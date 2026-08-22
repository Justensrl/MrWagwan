import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import {
  MARKET_META, TEST_END, OOS_START, metrics, groupMetrics,
  loadEvents, loadMarket, backtestMarket, splitTrades,
} from './backtest_core.mjs';

const OUT = new URL('../generated/', import.meta.url);
await mkdir(OUT, { recursive: true });
let priorOosMarker = null;
try { priorOosMarker = JSON.parse(await readFile(new URL('final_oos_execution.json', OUT), 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (priorOosMarker) throw new Error(`Final OOS already executed at ${priorOosMarker.executedAt}; refusing a second run`);
let priorFinalOutput = false;
try { await readFile(new URL('../MRWAGWAN_HYBRID_BACKTESTS.json', import.meta.url)); priorFinalOutput = true; }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (priorFinalOutput) throw new Error('Final backtest output already exists without a matching execution marker; refusing to overwrite it');
const freezeRaw = await readFile(new URL('selected_config_freeze.json', OUT), 'utf8');
const freeze = JSON.parse(freezeRaw);
const configHash = createHash('sha256').update(JSON.stringify(freeze.selectedConfig)).digest('hex');
if (configHash !== freeze.selectedConfigSha256) throw new Error('Selected config hash mismatch');
if (Date.parse(freeze.oosStartUtc) !== OOS_START) throw new Error('OOS boundary mismatch');
const phase1Raw = await readFile(new URL('phase1_ablation.json', OUT));
if (createHash('sha256').update(phase1Raw).digest('hex') !== freeze.phase1Sha256) throw new Error('Phase 1 hash mismatch');
const phase1TrialsRaw = await readFile(new URL('phase1_trial_trades.json', OUT));
if (createHash('sha256').update(phase1TrialsRaw).digest('hex') !== freeze.phase1TrialsSha256) throw new Error('Phase 1 trial hash mismatch');
const phase1Trials = JSON.parse(phase1TrialsRaw).trades;
const preregistrationInputs = {
  strategy: new URL('../MRWAGWAN_HYBRID_STRATEGY.md', import.meta.url),
  backtestCore: new URL('./backtest_core.mjs', import.meta.url),
  newsRegistry: new URL('../raw/high_impact_events_2024-08_2025-07.json', import.meta.url),
  dataManifest: new URL('../raw/dukascopy/manifest.json', import.meta.url),
};
for (const [name, url] of Object.entries(preregistrationInputs)) {
  const bytes = await readFile(url);
  const frozenBytes = name === 'strategy' ? Buffer.from(bytes.toString('utf8').split('<!-- GENERATED_RESULTS_START -->')[0]) : bytes;
  const actual = createHash('sha256').update(frozenBytes).digest('hex');
  if (actual !== freeze.preregistrationInputSha256?.[name]) throw new Error(`Preregistration input hash mismatch: ${name}`);
}

const events = await loadEvents(); const allTrades = []; const perMarket = {}; const data = {};
for (const market of Object.keys(MARKET_META)) {
  process.stdout.write(`Final frozen run ${market}...\n`);
  const series = await loadMarket(market, freeze.selectedConfig);
  data[market] = { ...series.payloadMeta, bars1m: series.m1.length, firstTime: series.m1[0].time, lastTime: series.m1.at(-1).time, proxy: MARKET_META[market].proxy ?? null };
  const run = backtestMarket(series, market, freeze.selectedConfig, events, { end: TEST_END });
  allTrades.push(...run.trades);
  const split = splitTrades(run.trades);
  perMarket[market] = { all: metrics(run.trades), is: metrics(split.is), wf: metrics(split.wf), finalOos: metrics(split.oos), funnel: run.funnel };
}
allTrades.sort((a, b) => a.entryTime - b.entryTime || a.market.localeCompare(b.market));
allTrades.forEach((t, i) => {
  t.tradeId = `HYB-${String(i + 1).padStart(5, '0')}`;
  t.entryTimeUtc = new Date(t.entryTime).toISOString();
  t.exitTimeUtc = new Date(t.exitTime).toISOString();
  // Explicit aliases keep the machine-readable schema aligned with the
  // terminology in the research specification without changing calculations.
  t.sl = t.stop;
  t.actualR = t.realizedR;
  t.holdingDurationMinutes = t.durationMinutes;
  t.winLossBreakEven = t.result;
});
const split = splitTrades(allTrades);
const finalOosTrials = split.oos.map((t) => ({
  ...t, researchPhase: 'FINAL_FROZEN_OOS', strategyVariant: t.ruleVersion,
  testId: null,
}));
const researchTrials = [...phase1Trials, ...finalOosTrials]
  .sort((a, b) => a.entryTime - b.entryTime || a.market.localeCompare(b.market) || a.ruleVersion.localeCompare(b.ruleVersion));
researchTrials.forEach((t, i) => { t.testId = `TEST-${String(i + 1).padStart(6, '0')}`; });
const researchTrialCountsByMarket = Object.fromEntries(Object.keys(MARKET_META).map((market) => [market, researchTrials.filter((t) => t.market === market).length]));
const manifest = JSON.parse(await readFile(new URL('../raw/dukascopy/manifest.json', import.meta.url), 'utf8'));
const report = {
  schemaVersion: 1, generatedAt: new Date().toISOString(), strategyVersion: freeze.selectedConfig.id,
  frozenSelection: freeze, sourceManifest: manifest, data,
  methodology: { chronological: true, lookahead: false, stopFirstSameMinute: true, bidAskExecution: true, sessionsTimeZone: 'Europe/Berlin', finalOosRunOnceByScript: true, repositorySourceCommit: freeze.repositorySourceCommit },
  boundariesUtc: { isEndExclusive: '2025-02-01T00:00:00.000Z', walkForwardEndExclusive: '2025-05-01T00:00:00.000Z', finalEndExclusive: '2025-08-01T00:00:00.000Z' },
  summary: {
    all: metrics(allTrades), is: metrics(split.is), walkForward: metrics(split.wf), finalOos: metrics(split.oos), perMarket,
    bySession: groupMetrics(allTrades, (t) => t.session), byDirection: groupMetrics(allTrades, (t) => t.direction),
    byVolatility: groupMetrics(allTrades, (t) => t.regime.volatility), byStructureRegime: groupMetrics(allTrades, (t) => t.regime.structure),
    byRiskRegime: groupMetrics(allTrades, (t) => t.regime.risk), byMonth: groupMetrics(allTrades, (t) => t.entryTimeUtc.slice(0, 7)),
    byNewsEventDay: groupMetrics(allTrades, (t) => t.newsEventDay ? 'event_day' : 'non_event_day'),
  },
  researchTrialSummary: {
    definition: 'All fully simulated IS/WF candidate/ablation trades plus the frozen selected variant final-OOS trades. Correlated variants are test coverage, not independent performance observations.',
    totalTests: researchTrials.length,
    byMarket: researchTrialCountsByMarket,
    isWfCandidateTests: phase1Trials.length,
    finalFrozenOosTests: finalOosTrials.length,
  },
  researchTrials,
  trades: allTrades,
};
const finalText = `${JSON.stringify(report, null, 2)}\n`;
await writeFile(new URL('../MRWAGWAN_HYBRID_BACKTESTS.json', import.meta.url), finalText, 'utf8');
await writeFile(new URL('final_oos_execution.json', OUT), `${JSON.stringify({
  executedAt: new Date().toISOString(),
  repositorySourceCommit: freeze.repositorySourceCommit,
  selectedConfigId: freeze.selectedConfig.id,
  finalOosTrades: split.oos.length,
  outputSha256: createHash('sha256').update(finalText).digest('hex'),
  assertion: 'The phase-2 script refuses another final-OOS run while this marker exists.',
}, null, 2)}\n`, 'utf8');
process.stdout.write(`Final selected trades: ${allTrades.length}; OOS: ${split.oos.length}\n`);
