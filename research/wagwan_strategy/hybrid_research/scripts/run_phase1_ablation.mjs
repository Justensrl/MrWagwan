import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import {
  VARIANTS, MARKET_META, OOS_START, IS_END, metrics, groupMetrics,
  loadEvents, loadMarket, backtestMarket, splitTrades,
} from './backtest_core.mjs';

const OUT = new URL('../generated/', import.meta.url);
await mkdir(OUT, { recursive: true });
try {
  const marker = JSON.parse(await readFile(new URL('final_oos_execution.json', OUT), 'utf8'));
  throw new Error(`Final OOS already executed at ${marker.executedAt}; refusing to regenerate Phase 1`);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const repositorySourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const preregistrationInputs = {
  strategy: new URL('../MRWAGWAN_HYBRID_STRATEGY.md', import.meta.url),
  backtestCore: new URL('./backtest_core.mjs', import.meta.url),
  newsRegistry: new URL('../raw/high_impact_events_2024-08_2025-07.json', import.meta.url),
  dataManifest: new URL('../raw/dukascopy/manifest.json', import.meta.url),
};
const preregistrationInputSha256 = {};
for (const [name, url] of Object.entries(preregistrationInputs)) {
  const bytes = await readFile(url);
  const frozenBytes = name === 'strategy' ? Buffer.from(bytes.toString('utf8').split('<!-- GENERATED_RESULTS_START -->')[0]) : bytes;
  preregistrationInputSha256[name] = createHash('sha256').update(frozenBytes).digest('hex');
}
const events = await loadEvents();
const results = [];
const trialTrades = [];
const seriesByMarket = {};

function enrichTrade(t, researchPhase) {
  return {
    ...t, researchPhase, strategyVariant: t.ruleVersion,
    entryTimeUtc: new Date(t.entryTime).toISOString(), exitTimeUtc: new Date(t.exitTime).toISOString(),
    sl: t.stop, actualR: t.realizedR, holdingDurationMinutes: t.durationMinutes, winLossBreakEven: t.result,
  };
}

for (const market of Object.keys(MARKET_META)) {
  process.stdout.write(`Loading ${market}...\n`);
  seriesByMarket[market] = await loadMarket(market);
}

for (const config of VARIANTS) {
  process.stdout.write(`Development run ${config.id}...\n`);
  const all = []; const perMarket = {}; const funnels = {};
  for (const market of Object.keys(MARKET_META)) {
    const run = backtestMarket(seriesByMarket[market], market, config, events, { end: OOS_START });
    const split = splitTrades(run.trades);
    all.push(...run.trades);
    trialTrades.push(...run.trades.map((t) => enrichTrade(t, 'IS_WF_CANDIDATE_TRIAL')));
    perMarket[market] = { allDevelopment: metrics(run.trades), is: metrics(split.is), wf: metrics(split.wf) };
    funnels[market] = run.funnel;
  }
  const split = splitTrades(all);
  results.push({
    config, diagnosticOnly: Boolean(config.diagnosticOnly),
    development: metrics(all), is: metrics(split.is), wf: metrics(split.wf),
    wfByMarket: groupMetrics(split.wf, (t) => t.market), perMarket, funnels,
  });
}

const baseline = results.find((r) => r.config.id === 'BASE_HYBRID_PREREG_1_0');
function median(values) { const a = values.slice().sort((x, y) => x - y); return a.length ? a[Math.floor(a.length / 2)] : -Infinity; }
function qualifies(candidate) {
  if (candidate.diagnosticOnly || candidate.config.id === baseline.config.id) return false;
  const wfMarkets = Object.values(candidate.wfByMarket);
  return candidate.wf.trades >= 100
    && Object.keys(MARKET_META).every((m) => (candidate.wfByMarket[m]?.trades ?? 0) >= 10)
    && candidate.wf.expectancyR >= (baseline.wf.expectancyR ?? -Infinity) + 0.10
    && candidate.is.expectancyR > 0
    && wfMarkets.filter((m) => (m.expectancyR ?? -Infinity) >= 0).length >= 3;
}
const eligible = results.filter(qualifies).sort((a, b) => {
  const am = median(Object.values(a.wfByMarket).map((m) => m.expectancyR ?? -Infinity));
  const bm = median(Object.values(b.wfByMarket).map((m) => m.expectancyR ?? -Infinity));
  return bm - am;
});
const selected = eligible[0] ?? baseline;
const report = {
  schemaVersion: 1, generatedAt: new Date().toISOString(), phase: 'IS + walk-forward only; final OOS not read by this run',
  boundariesUtc: { isEndExclusive: new Date(IS_END).toISOString(), wfEndExclusive: new Date(OOS_START).toISOString() },
  selectionRule: 'Baseline unless one single non-diagnostic ablation beats baseline WF expectancy by >=0.10R, has positive IS expectancy, >=100 WF trades and >=10/market, and >=3/5 non-negative WF markets; tie by median market WF expectancy.',
  selectedConfigId: selected.config.id, eligibleConfigIds: eligible.map((r) => r.config.id),
  trialTradeCount: trialTrades.length,
  trialCountsByMarket: Object.fromEntries(Object.keys(MARKET_META).map((market) => [market, trialTrades.filter((t) => t.market === market).length])),
  results,
};
trialTrades.sort((a, b) => a.entryTime - b.entryTime || a.market.localeCompare(b.market) || a.ruleVersion.localeCompare(b.ruleVersion));
trialTrades.forEach((t, i) => { t.testId = `DEV-${String(i + 1).padStart(6, '0')}`; });
const trialText = `${JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), phase: 'IS/WF candidate and ablation trials only; no final OOS', trades: trialTrades }, null, 2)}\n`;
await writeFile(new URL('phase1_trial_trades.json', OUT), trialText, 'utf8');
const text = `${JSON.stringify(report, null, 2)}\n`;
await writeFile(new URL('phase1_ablation.json', OUT), text, 'utf8');
const phase1Sha256 = createHash('sha256').update(text).digest('hex');
const configText = JSON.stringify(selected.config);
const freeze = {
  frozenAt: new Date().toISOString(), selectedConfig: selected.config,
  selectedConfigSha256: createHash('sha256').update(configText).digest('hex'),
  phase1Sha256, phase1TrialsSha256: createHash('sha256').update(trialText).digest('hex'),
  preregistrationInputSha256, repositorySourceCommit, oosStartUtc: new Date(OOS_START).toISOString(),
  assertion: 'Selection completed without running final OOS in this script.',
};
await writeFile(new URL('selected_config_freeze.json', OUT), `${JSON.stringify(freeze, null, 2)}\n`, 'utf8');
process.stdout.write(`Frozen selection: ${selected.config.id}\n`);
