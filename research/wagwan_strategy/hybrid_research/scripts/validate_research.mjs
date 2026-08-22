import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { readFile, writeFile } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url);
const failures = []; const warnings = []; const checks = [];
function check(id, condition, details) { checks.push({ id, status: condition ? 'PASS' : 'FAIL', details }); if (!condition) failures.push({ id, details }); }

const manifest = JSON.parse(await readFile(new URL('raw/dukascopy/manifest.json', ROOT), 'utf8'));
check('data.manifest.count', manifest.instruments.length === 5, { actual: manifest.instruments.length, expected: 5 });
const dataAudit = {};
let xauBarsForWidgetCheck = null;
for (const item of manifest.instruments) {
  const bytes = await readFile(new URL(`raw/dukascopy/${item.filename}`, ROOT));
  const sha = createHash('sha256').update(bytes).digest('hex');
  check(`data.${item.market}.sha256`, sha === item.sha256, { actual: sha, expected: item.sha256 });
  const payload = JSON.parse(gunzipSync(bytes)); const bars = payload.bars;
  let unsorted = 0; let duplicates = 0; let negativeSpread = 0; let invalidOhlc = 0; let unaligned = 0; let maxGapMin = 0; let gapsOver60 = 0;
  const distinctUtcDays = new Set();
  for (let i = 0; i < bars.length; i += 1) {
    const b = bars[i]; distinctUtcDays.add(new Date(b[0]).toISOString().slice(0, 10));
    if (b[5] < b[1] || b[6] < b[2] || b[7] < b[3] || b[8] < b[4]) negativeSpread += 1;
    if (b[2] < Math.max(b[1], b[4]) || b[3] > Math.min(b[1], b[4]) || b[6] < Math.max(b[5], b[8]) || b[7] > Math.min(b[5], b[8]) || b.slice(1, 9).some((x) => !(x > 0))) invalidOhlc += 1;
    if (b[0] % 60_000 !== 0) unaligned += 1;
    if (i) {
      const gap = (bars[i][0] - bars[i - 1][0]) / 60_000;
      if (gap < 0) unsorted += 1; if (gap === 0) duplicates += 1;
      maxGapMin = Math.max(maxGapMin, gap); if (gap > 60) gapsOver60 += 1;
    }
  }
  dataAudit[item.market] = { bars: bars.length, distinctUtcDays: distinctUtcDays.size, firstUtc: new Date(bars[0][0]).toISOString(), lastUtc: new Date(bars.at(-1)[0]).toISOString(), unsorted, duplicates, negativeSpread, invalidOhlc, unaligned, maxGapMin, gapsOver60 };
  check(`data.${item.market}.minimumBars`, bars.length >= 100_000, { bars: bars.length });
  check(`data.${item.market}.calendarCoverage`, distinctUtcDays.size >= 240, { distinctUtcDays: distinctUtcDays.size, required: 240 });
  check(`data.${item.market}.rangeCoverage`, bars[0][0] < Date.parse('2024-08-04T00:00:00Z') && bars.at(-1)[0] >= Date.parse('2025-07-29T00:00:00Z'), { firstUtc: dataAudit[item.market].firstUtc, lastUtc: dataAudit[item.market].lastUtc });
  check(`data.${item.market}.ordering`, unsorted === 0 && duplicates === 0, { unsorted, duplicates });
  check(`data.${item.market}.spreadNonnegative`, negativeSpread === 0, { negativeSpread });
  check(`data.${item.market}.ohlcGeometry`, invalidOhlc === 0, { invalidOhlc });
  check(`data.${item.market}.minuteAligned`, unaligned === 0, { unaligned });
  if (item.market === 'XAUUSD') xauBarsForWidgetCheck = bars;
}
const widgetCsvText = await readFile(new URL('raw/validation/XAU-USD_1Minute_BID_2024-08-01_official_widget.csv', ROOT), 'utf8');
const widgetRows = widgetCsvText.trim().split(/\r?\n/).slice(1).map((line) => line.split(','));
const dayStart = Date.parse('2024-08-01T00:00:00Z'); const dayEnd = Date.parse('2024-08-02T00:00:00Z');
const decodedRows = (xauBarsForWidgetCheck ?? []).filter((bar) => bar[0] >= dayStart && bar[0] < dayEnd);
let widgetMismatches = Math.abs(widgetRows.length - decodedRows.length);
for (let i = 0; i < Math.min(widgetRows.length, decodedRows.length); i += 1) {
  const csv = widgetRows[i]; const bar = decodedRows[i];
  const csvTime = Date.parse(csv[0]); const values = csv.slice(1).map(Number);
  if (csvTime !== bar[0] || values.some((value, j) => value !== [bar[1], bar[2], bar[3], bar[4], bar[9]][j])) widgetMismatches += 1;
}
check('data.XAUUSD.officialWidgetCsvExact', widgetMismatches === 0 && widgetRows.length === 1380, { widgetRows: widgetRows.length, decodedRows: decodedRows.length, mismatches: widgetMismatches });

const phase1Raw = await readFile(new URL('generated/phase1_ablation.json', ROOT), 'utf8');
const phase1 = JSON.parse(phase1Raw);
const freeze = JSON.parse(await readFile(new URL('generated/selected_config_freeze.json', ROOT), 'utf8'));
check('selection.phase1.hash', createHash('sha256').update(phase1Raw).digest('hex') === freeze.phase1Sha256, {});
const phase1TrialsRaw = await readFile(new URL('generated/phase1_trial_trades.json', ROOT));
check('selection.phase1.trials.hash', createHash('sha256').update(phase1TrialsRaw).digest('hex') === freeze.phase1TrialsSha256, {});
check('selection.oos.boundary', freeze.oosStartUtc === '2025-05-01T00:00:00.000Z', { actual: freeze.oosStartUtc });
check('selection.config.id', phase1.selectedConfigId === freeze.selectedConfig.id, { phase1: phase1.selectedConfigId, freeze: freeze.selectedConfig.id });
const frozenInputs = {
  strategy: new URL('MRWAGWAN_HYBRID_STRATEGY.md', ROOT),
  backtestCore: new URL('scripts/backtest_core.mjs', ROOT),
  newsRegistry: new URL('raw/high_impact_events_2024-08_2025-07.json', ROOT),
  dataManifest: new URL('raw/dukascopy/manifest.json', ROOT),
};
for (const [name, url] of Object.entries(frozenInputs)) {
  const bytes = await readFile(url);
  const frozenBytes = name === 'strategy' ? Buffer.from(bytes.toString('utf8').split('<!-- GENERATED_RESULTS_START -->')[0]) : bytes;
  const actual = createHash('sha256').update(frozenBytes).digest('hex');
  check(`selection.input.${name}.hash`, actual === freeze.preregistrationInputSha256?.[name], { actual, expected: freeze.preregistrationInputSha256?.[name] });
}

const final = JSON.parse(await readFile(new URL('MRWAGWAN_HYBRID_BACKTESTS.json', ROOT), 'utf8'));
const trades = final.trades; const markets = ['XAUUSD', 'BTCUSD', 'NASDAQ', 'SP500', 'EURUSD'];
const researchTrials = final.researchTrials ?? [];
check('backtest.minimumTotal', researchTrials.length >= 1000, { actual: researchTrials.length, required: 1000, definition: final.researchTrialSummary?.definition });
for (const market of markets) check(`backtest.${market}.minimum200`, researchTrials.filter((t) => t.market === market).length >= 200, { actual: researchTrials.filter((t) => t.market === market).length, required: 200 });
check('backtest.tradeIdsUnique', new Set(trades.map((t) => t.tradeId)).size === trades.length, {});
check('backtest.testIdsUnique', new Set(researchTrials.map((t) => t.testId)).size === researchTrials.length, {});
check('backtest.frozenVersion', trades.every((t) => t.ruleVersion === freeze.selectedConfig.id), { selected: freeze.selectedConfig.id });
check('backtest.noOutsideSessions', trades.every((t) => ['Asia', 'London', 'NewYork'].includes(t.session)), {});
check('backtest.noCrossSession', trades.every((t) => t.sessionKey && t.durationMinutes > 0 && t.durationMinutes <= 420), {});
check('backtest.stopGeometry', trades.every((t) => t.direction === 'long' ? t.stop < t.entry && t.entry < t.tp1 && t.tp1 < t.tp2 && t.tp2 < t.tp3 : t.stop > t.entry && t.entry > t.tp1 && t.tp1 > t.tp2 && t.tp2 > t.tp3), {});
check('backtest.finiteR', trades.every((t) => Number.isFinite(t.realizedR) && Number.isFinite(t.mfeR) && Number.isFinite(t.maeR)), {});
check('backtest.chronological', trades.every((t, i) => i === 0 || t.entryTime >= trades[i - 1].entryTime), {});
check('backtest.hasFinalOos', trades.some((t) => t.entryTime >= Date.parse('2025-05-01T00:00:00Z')), { oosTrades: final.summary.finalOos.trades });
const requiredTradeFields = [
  'tradeId', 'market', 'feed', 'dateEuropeBerlin', 'session', 'direction',
  'context1h', 'context15m', 'context5m', 'context1m', 'entry', 'sl', 'tp1', 'tp2', 'tp3',
  'plannedRR', 'actualR', 'winLossBreakEven', 'holdingDurationMinutes', 'mfeR', 'maeR',
  'liquidityClass', 'mss', 'choch', 'bos', 'displacementAtr', 'fvgPresent', 'orderBlock',
  'premiumDiscount', 'costs', 'ruleVersion', 'researchSplit',
];
check('backtest.requiredTradeFields', trades.every((t) => requiredTradeFields.every((key) => Object.hasOwn(t, key))), { requiredTradeFields });
const requiredResearchTrialFields = requiredTradeFields.filter((key) => key !== 'tradeId');
check('backtest.researchTrials.requiredTradeFields', researchTrials.every((t) => requiredResearchTrialFields.every((key) => Object.hasOwn(t, key)) && Object.hasOwn(t, 'testId') && Object.hasOwn(t, 'researchPhase') && Object.hasOwn(t, 'strategyVariant')), { requiredResearchTrialFields });
check('backtest.researchTrials.chronological', researchTrials.every((t, i) => i === 0 || t.entryTime >= researchTrials[i - 1].entryTime), {});
check('backtest.researchTrialCountsConsistent', final.researchTrialSummary?.totalTests === researchTrials.length && markets.every((market) => final.researchTrialSummary?.byMarket?.[market] === researchTrials.filter((t) => t.market === market).length), { totalTests: final.researchTrialSummary?.totalTests, actual: researchTrials.length });
check('backtest.validSplits', trades.every((t) => ['IS', 'WF', 'OOS'].includes(t.researchSplit)), {});
check('backtest.oosBoundaryConsistent', trades.every((t) => t.researchSplit === (t.entryTime < Date.parse('2025-02-01T00:00:00Z') ? 'IS' : t.entryTime < Date.parse('2025-05-01T00:00:00Z') ? 'WF' : 'OOS')), {});
check('backtest.metricCountConsistent', final.summary.all.trades === trades.length && final.summary.finalOos.trades === trades.filter((t) => t.researchSplit === 'OOS').length, { jsonTrades: trades.length, summaryTrades: final.summary.all.trades });
for (const market of markets) {
  const mt = trades.filter((t) => t.market === market).sort((a, b) => a.entryTime - b.entryTime);
  let overlaps = 0;
  for (let i = 1; i < mt.length; i += 1) if (mt[i].entryTime <= mt[i - 1].exitTime) overlaps += 1;
  check(`backtest.${market}.noOverlap`, overlaps === 0, { overlaps });
}

const required = [
  'VIDEO_STRATEGY_EXTRACTION.md', 'VIDEO_VS_MRWAGWAN_COMPARISON.md', 'MRWAGWAN_HYBRID_STRATEGY.md',
  'MRWAGWAN_HYBRID_BACKTESTS.json', 'MRWAGWAN_HYBRID_RESULTS.md', 'MRWAGWAN_ABLATION_RESULTS.md',
  'MRWAGWAN_MARKET_COMPARISON.md', 'MRWAGWAN_RESEARCH_LOG.md',
];
for (const file of required) {
  try { const x = await readFile(new URL(file, ROOT)); check(`artifact.${file}`, x.length > 100, { bytes: x.length }); }
  catch (error) { check(`artifact.${file}`, false, { error: error.message }); }
}
const strategyFinal = await readFile(new URL('MRWAGWAN_HYBRID_STRATEGY.md', ROOT), 'utf8');
check('artifact.strategy.generatedResults', strategyFinal.includes(`Eingefrorene Regelversion: \`${final.strategyVersion}\``) && strategyFinal.includes(`| Gesamt | ${final.summary.all.trades} |`), {});

const validation = { generatedAt: new Date().toISOString(), status: failures.length ? 'FAIL' : 'PASS', checks, failures, warnings, dataAudit };
await writeFile(new URL('generated/validation.json', ROOT), `${JSON.stringify(validation, null, 2)}\n`, 'utf8');
process.stdout.write(`Validation ${validation.status}: ${checks.length - failures.length}/${checks.length} passed\n`);
if (failures.length) process.exitCode = 1;
