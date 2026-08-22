import { readFile, writeFile } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url);
const final = JSON.parse(await readFile(new URL('MRWAGWAN_HYBRID_BACKTESTS.json', ROOT), 'utf8'));
const phase1 = JSON.parse(await readFile(new URL('generated/phase1_ablation.json', ROOT), 'utf8'));
const validationPath = new URL('generated/validation.json', ROOT);
let validation = null; try { validation = JSON.parse(await readFile(validationPath, 'utf8')); } catch {}

const n = (x, d = 2) => x === null || x === undefined || !Number.isFinite(x) ? 'n/a' : Number(x).toFixed(d);
const pct = (x) => x === null || x === undefined ? 'n/a' : `${(100 * x).toFixed(1)}%`;
const mrow = (label, m) => `| ${label} | ${m.trades} | ${pct(m.winRate)} | ${n(m.expectancyR)} | ${n(m.totalR)} | ${n(m.profitFactor)} | ${n(m.maxDrawdownR)} | ${n(m.averageMfeR)} | ${n(m.averageMaeR)} |`;
const tableHeader = '| Segment | Trades | Win-Rate | Ø R | Gesamt-R | PF | Max DD R | Ø MFE R | Ø MAE R |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|';

const oosMarkets = Object.entries(final.summary.perMarket).map(([market, x]) => ({ market, ...x.finalOos }));
const nonNegative = oosMarkets.filter((x) => (x.expectancyR ?? -Infinity) >= 0).length;
const marketPositiveR = oosMarkets.map((x) => Math.max(0, x.totalR ?? 0));
const totalPositiveR = marketPositiveR.reduce((a, b) => a + b, 0);
const maxContribution = totalPositiveR > 0 ? Math.max(...marketPositiveR) / totalPositiveR : 1;
const oos = final.summary.finalOos;
const promising = oos.expectancyR > 0 && oos.profitFactor > 1.05 && nonNegative >= 3 && maxContribution <= 0.60;
const trialSummary = final.researchTrialSummary;
const minTotal = trialSummary.totalTests >= 1000;
const minEach = Object.values(trialSummary.byMarket).every((count) => count >= 200);
const strategyStatus = promising ? 'PROMISING – MORE DATA REQUIRED' : 'NOT VALIDATED';

const results = `# MrWagwan Hybrid — Backtest-Ergebnisse

Stand: ${final.generatedAt}  
Regelversion: \`${final.strategyVersion}\`  
Preregistered source commit: \`${final.frozenSelection.repositorySourceCommit}\`
Status: **${strategyStatus}**

## Harte Aussage

${promising ? 'Die vorab eingefrorene Variante erfüllt die preregistrierten OOS-Mindestbedingungen. Das ist ein Research-Signal, keine Handelsfreigabe.' : 'Die vorab eingefrorene Variante erfüllt die preregistrierten OOS-Mindestbedingungen nicht. Es gibt damit keinen belastbaren Nachweis eines handelbaren Vorteils.'}

Der Backtest verwendet historische 1m-Bid-/Ask-Kerzen, adverse Slippage, Stop-first bei intraminütiger Ambiguität, exakt abgegrenzte Berlin-Sessions und einen einmaligen finalen OOS-Lauf. NASDAQ/SP500 sind Dukascopy-CFD-Proxys, nicht CME NQ/ES.

## Research-Testabdeckung

Es wurden **${trialSummary.totalTests} vollständige Tests** gespeichert: ${trialSummary.isWfCandidateTests} IS/WF-Kandidaten-/Ablationstrades und ${trialSummary.finalFrozenOosTests} Trades der eingefrorenen Variante im finalen OOS. Varianten auf derselben Marktbewegung sind korreliert; diese Zahl belegt Testabdeckung und darf nicht als unabhängige Gesamtperformance interpretiert werden.

| Markt | vollständige Research-Tests |
|---|---:|
${Object.entries(trialSummary.byMarket).map(([market, count]) => `| ${market} | ${count} |`).join('\n')}

## Gesamt und Zeit-Splits

${tableHeader}
${mrow('Gesamt', final.summary.all)}
${mrow('In-Sample', final.summary.is)}
${mrow('Walk-forward', final.summary.walkForward)}
${mrow('Final OOS', final.summary.finalOos)}

95%-Intervall des finalen OOS-Erwartungswerts: **${n(oos.expectancy95[0])}R bis ${n(oos.expectancy95[1])}R**. Dieses Intervall zeigt Stichprobenunsicherheit; es ist keine Gewinnprognose.

## Marktweise Ergebnisse

| Markt | Gesamt Trades | Gesamt ØR | Gesamt PF | OOS Trades | OOS Win-Rate | OOS ØR | OOS PF | OOS Max DD R |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
${Object.entries(final.summary.perMarket).map(([market, x]) => `| ${market} | ${x.all.trades} | ${n(x.all.expectancyR)} | ${n(x.all.profitFactor)} | ${x.finalOos.trades} | ${pct(x.finalOos.winRate)} | ${n(x.finalOos.expectancyR)} | ${n(x.finalOos.profitFactor)} | ${n(x.finalOos.maxDrawdownR)} |`).join('\n')}

## Session- und Regimevergleich (gesamter eingefrorener Lauf)

### Sessions

${tableHeader}
${Object.entries(final.summary.bySession).map(([k, v]) => mrow(k, v)).join('\n')}

### Volatilität

${tableHeader}
${Object.entries(final.summary.byVolatility).map(([k, v]) => mrow(k, v)).join('\n')}

### Strukturregime

${tableHeader}
${Object.entries(final.summary.byStructureRegime).map(([k, v]) => mrow(k, v)).join('\n')}

### Risk-on/Risk-off-Proxy

Nur BTCUSD/NASDAQ/SP500 werden deskriptiv klassifiziert: bullish 1H = \`risk_on_proxy\`, bearish 1H = \`risk_off_proxy\`. Für XAUUSD/EURUSD wird kein makroökonomischer Zustand aus Preisrichtung erfunden.

${tableHeader}
${Object.entries(final.summary.byRiskRegime).map(([k, v]) => mrow(k, v)).join('\n')}

## News-Effekt

Die Basis blockiert Entries +/-60 Minuten um den verifizierten Kern aus FOMC-, CPI-, PPI-, NFP- und für EURUSD ECB-Entscheidungen. Ein reiner Vergleich von Event- zu Nicht-Event-Tagen ist nicht kausal, weil der Filter gerade die unmittelbare Releasezone entfernt. Das Register ist ausdrücklich nicht vollständig: PCE, GDP, Retail Sales, ISM sowie ungeplante Red-News/Reden fehlen in diesem Lauf.

${tableHeader}
${Object.entries(final.summary.byNewsEventDay).map(([k, v]) => mrow(k, v)).join('\n')}

Die kausalere Ein-Regel-Ablation (kein Filter / 30 / 60 / 120 Minuten / ganzer Tag) steht in \`MRWAGWAN_ABLATION_RESULTS.md\` und wurde nur auf IS + Walk-forward ausgewertet.

## Stichproben- und Freigabekriterien

| Kriterium | Ergebnis |
|---|---|
| >=1.000 vollständige Research-Tests | ${minTotal ? 'PASS' : 'FAIL'} (${trialSummary.totalTests}) |
| >=200 Research-Tests je Markt | ${minEach ? 'PASS' : 'FAIL'} (${Object.entries(trialSummary.byMarket).map(([k, v]) => `${k} ${v}`).join(', ')}) |
| Trades der final ausgewählten Variante | INFO (${final.summary.all.trades}; nicht künstlich erhöht) |
| OOS ØR > 0 | ${oos.expectancyR > 0 ? 'PASS' : 'FAIL'} (${n(oos.expectancyR)}R) |
| OOS PF > 1,05 | ${oos.profitFactor > 1.05 ? 'PASS' : 'FAIL'} (${n(oos.profitFactor)}) |
| >=3/5 OOS-Märkte nicht-negativ | ${nonNegative >= 3 ? 'PASS' : 'FAIL'} (${nonNegative}/5) |
| Kein Markt >60% positiver OOS-Beitrag | ${maxContribution <= 0.60 ? 'PASS' : 'FAIL'} (${pct(maxContribution)}) |

## Einschränkungen

- Der Zeitraum umfasst exakt zwölf Monate, aber nur **eine** historische Jahresprobe.
- CFD-Proxys können Futures-Session, Roll, Liquidität und Kosten nicht identisch abbilden.
- Dukascopy-Bid/Ask ist eine Datenquelle; modellierte Zusatzslippage ist keine Garantie echter Fills.
- FVG, Pivots, Origin-Zonen und MSS sind algorithmische Stellvertreter für diskretionäre SMC-Lesarten.
- Die Videostrategie basiert im Video im Wesentlichen auf einem Trade; ihre Regeln waren unvollständig und teils widersprüchlich.
- Viele getestete Ablationen erhöhen Multiple-Testing-Risiko. Der finale OOS blieb deshalb für die Auswahl gesperrt.
- Das Newsregister ist ein offiziell verifizierter Kernfilter, kein vollständiger historischer Wirtschaftskalender; News-/Nicht-News-Auswertungen sind deshalb nur für diesen Ereignissatz gültig.
- Finanzieller „erwarteter Profit“ wird in R berichtet. Bei rein illustrativem Modellrisiko 1% entspräche 1R etwa 1% des jeweiligen damaligen Modellkapitals; dies ist keine Prognose.
`;

const baseline = phase1.results.find((x) => x.config.id === 'BASE_HYBRID_PREREG_1_0');
const byId = Object.fromEntries(phase1.results.map((x) => [x.config.id, x]));
const ruleRows = [
  { rule: 'Video-POI/Origin-Mitigation als Pflicht', id: 'ABL_POI_REQUIRED', mode: 'variant' },
  { rule: '1m-FVG-Retest statt sofortigem Market-Entry', id: 'ABL_MARKET_ENTRY', mode: 'inverse' },
  { rule: 'Countertrend nur an externer SSL/BSL + POI', id: 'ABL_COUNTERTREND', mode: 'variant' },
  { rule: 'Mindestens 1R Raum bis bekannter Gegenliquidität', id: 'ABL_NO_TARGET_SPACE', mode: 'inverse' },
  { rule: 'V-Reclaim innerhalb zwei 5m-Kerzen', id: 'ABL_V_REACTION', mode: 'variant' },
  { rule: '5m-Drei-Candle-FVG als Pflicht', id: 'ABL_NO_FVG', mode: 'inverse' },
];
function ruleLine(x) {
  const v = byId[x.id]; const withRule = x.mode === 'variant' ? v.wf : baseline.wf; const withoutRule = x.mode === 'variant' ? baseline.wf : v.wf;
  const delta = withRule.expectancyR === null || withoutRule.expectancyR === null ? null : withRule.expectancyR - withoutRule.expectancyR;
  const enough = withRule.trades >= 100;
  const decision = !enough ? '🧪 weitere Daten erforderlich' : delta >= 0.05 ? '✅ übernehmen (Research-Regel)' : delta > -0.03 ? '⚠️ optional' : '❌ verwerfen';
  return `| ${x.rule} | ${withRule.trades} | ${n(withoutRule.expectancyR)}R / PF ${n(withoutRule.profitFactor)} | ${n(withRule.expectancyR)}R / PF ${n(withRule.profitFactor)} | ${n(delta)}R | ${decision} |`;
}
const ablation = `# MrWagwan Hybrid — Ablation und Robustheit

Wichtig: **Alle Werte in diesem Dokument enden vor dem finalen OOS am 2025-05-01.** Sie dienen der Regelprüfung und Variantenwahl; kein OOS-Ergebnis wurde zur Auswahl verwendet.

| Variante | Typ | IS Trades | IS ØR | IS PF | WF Trades | WF ØR | WF PF | Δ WF ØR vs Basis | Auswahlhürde erfüllt |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
${phase1.results.map((r) => {
  const delta = r.wf.expectancyR === null || baseline.wf.expectancyR === null ? null : r.wf.expectancyR - baseline.wf.expectancyR;
  return `| ${r.config.id} | ${r.diagnosticOnly ? 'Sensitivität' : r.config.id.startsWith('ABL_') ? 'Ablation' : 'Basis'} | ${r.is.trades} | ${n(r.is.expectancyR)} | ${n(r.is.profitFactor)} | ${r.wf.trades} | ${n(r.wf.expectancyR)} | ${n(r.wf.profitFactor)} | ${n(delta)} | ${phase1.eligibleConfigIds.includes(r.config.id) ? 'JA' : 'NEIN'} |`;
}).join('\n')}

## Auswahl

Eingefroren wurde **${phase1.selectedConfigId}**. ${phase1.eligibleConfigIds.length ? `Qualifizierte Ablationen: ${phase1.eligibleConfigIds.join(', ')}.` : 'Keine Ablation überwand alle preregistrierten Hürden; deshalb blieb die Basis ausgewählt.'}

## Regelinterpretation

- **FVG:** \`ABL_NO_FVG\` isoliert die Pflicht eines echten Drei-Candle-Gaps.
- **1m-Retest:** \`ABL_MARKET_ENTRY\` misst den Preis für die strengere Retest-Bedingung in verpassten bzw. zusätzlichen Trades.
- **Video-POI:** \`ABL_POI_REQUIRED\` prüft, ob die objektivierte Origin-/Mitigation-Zone Mehrwert bringt.
- **Liquiditätsart:** \`ABL_EXTERNAL_ONLY\` trennt vorige Session-Levels von internen Pivots.
- **Bias/Countertrend:** \`ABL_NO_H1_BIAS\`, \`ABL_COUNTERTREND\` und \`ABL_H4_BIAS\` testen Kontextregeln getrennt.
- **News:** \`ABL_NEWS_NONE/30/120/DAY\` verändern nur das Eventfenster relativ zur 60-Minuten-Basis.
- **Target-Room und V-Reaktion:** testen die beiden direkt aus dem Video abgeleiteten Filter.
- **Frequenzdiagnose:** \`DIAG_FREQUENCY_SIMPLIFIED_MSS\` kombiniert ausnahmsweise drei Lockerungen (kein FVG-Zwang, Market-Entry, kein Target-Room), ist aber ausdrücklich nicht auswählbar und wird nie zur finalen Performancebehauptung verwendet.

## Video-Regeln einzeln

| Video-Regel | Tests | Baseline-Ergebnis | Ergebnis mit Regel | Veränderung | Entscheidung |
|---|---:|---:|---:|---:|---|
${ruleRows.map(ruleLine).join('\n')}
| Stop nach Entry weiter weg setzen | 0 | technischer Stop vor Entry | nicht getestet | n/a | ❌ verwerfen (Risikoerhöhung; Sicherheitsregel, kein Optimierungskandidat) |
| „Full Pot“-/Recovery-Risiko | 0 | 1R / illustrativ 1% Modellrisiko | nicht getestet | n/a | ❌ verwerfen (unvertretbares Risikomodell) |

## Parameterstabilität

Die \`SENS_*\`-Zeilen sind absichtlich nicht auswählbar. Ein Vorzeichenwechsel bei kleinen Änderungen von Sweep-, Displacement- oder Stop-Puffer-Schwelle ist ein Warnsignal für Instabilität. Selbst ein glatter lokaler Bereich beseitigt nicht das Risiko, dass die gesamte Regelklasse an dieses einzelne Jahr angepasst ist.

## Multiple Testing / Overfitting

Es wurden ${phase1.results.length - 1} Abweichungen von der Basis angesehen. Deshalb gilt ein optisch besserer Mittelwert nicht als Beweis. Die Auswahlhürde verlangt einen deutlichen WF-Abstand, Mindeststichprobe, positives IS und marktübergreifende Konsistenz; Ablationen werden für die Auswahl nicht kombiniert. Die einzige kombinierte Frequenzdiagnose ist nicht auswählbar. Das finale OOS wurde erst nach Hash-Freeze der Auswahl ausgeführt.
`;

const ranked = oosMarkets.slice().sort((a, b) => (b.expectancyR ?? -Infinity) - (a.expectancyR ?? -Infinity));
const marketComparison = `# MrWagwan Hybrid — Marktvergleich

Ranking nach **finalem OOS-Erwartungswert nach Kosten**. Bei kleinen oder überlappenden Unsicherheitsintervallen ist die Rangfolge nicht stabil.

| Rang | Markt | Instrument/Proxy | OOS Trades | OOS ØR | 95%-Intervall ØR | OOS PF | Win-Rate | Max DD R | Bewertung |
|---:|---|---|---:|---:|---|---:|---:|---:|---|
${ranked.map((x, i) => {
  const instrument = x.market === 'NASDAQ' ? 'Dukascopy USATECHIDXUSD CFD' : x.market === 'SP500' ? 'Dukascopy USA500IDXUSD CFD' : `Dukascopy ${x.market}`;
  const assessment = x.trades < 40 ? 'zu kleine OOS-Stichprobe' : x.expectancyR > 0 && x.profitFactor > 1.05 ? 'positiv, noch nicht live-validiert' : x.expectancyR >= 0 ? 'nahe Null / fragil' : 'negativ';
  return `| ${i + 1} | ${x.market} | ${instrument} | ${x.trades} | ${n(x.expectancyR)} | ${n(x.expectancy95[0])} bis ${n(x.expectancy95[1])} | ${n(x.profitFactor)} | ${pct(x.winRate)} | ${n(x.maxDrawdownR)} | ${assessment} |`;
}).join('\n')}

## Interpretation

- Das Ranking ist deskriptiv, keine Kauf-/Verkaufsempfehlung.
- NQ/NASDAQ und ES/SP500 wurden wegen frei reproduzierbarer Bid/Ask-Historie durch CFD-Indizes vertreten. Futures-spezifische Roll-, Tick-, Kommissions- und RTH-Effekte bleiben offen.
- BTCUSD handelt am Wochenende; die gleichen Berlin-Sessions werden trotzdem erzwungen. Das macht den Markt vergleichbar, aber nicht identisch zu institutionellen FX-/Indexbedingungen.
- Ein Markt mit positivem Gesamtwert und negativem Final OOS gilt nicht als robust. Final OOS hat Vorrang vor Gesamtwert.
`;

const log = `# MrWagwan Hybrid — Research Log und Handoff

## Durchgeführte Arbeit

1. Die vollständigen offiziellen YouTube-Auto-Captions (00:00–49:57) wurden exportiert und unverändert als Rohtext gespeichert.
2. Video, Beschreibung und sichtbare Chartsequenzen wurden getrennt als EXPLIZIT, ABGELEITET oder UNKLAR klassifiziert.
3. Bestehende MrWagwan-V3-, Session-, Risiko- und Marktberichte wurden gelesen; frühere Resultate wurden nicht als neue Evidenz umetikettiert.
4. Vor dem neuen Backtest wurden Vergleich, Hybridregeln, Daten-/Kostenmodell, Ablationen, Sensitivitäten, Auswahlhürde und OOS-Grenze schriftlich preregistriert.
5. Offizielle BLS-, Fed- und ECB-Kalender wurden auf einen konservativen Kern ausgewählter Hochrisikoereignisse reduziert; historische DST wurde in UTC-Zeitstempel umgerechnet. Fehlende PCE/GDP/Retail/ISM-Abdeckung ist ausdrücklich dokumentiert.
6. Zwölf Monate Dukascopy-1m-Bid/Ask-Daten wurden über die offiziellen seriellen JETTA-Tagesendpunkte mit Cache/Retry geladen, zusammengeführt, komprimiert, gehasht und auf Reihenfolge, Duplikate, Umfang und Spread geprüft. Der Decoder wurde am XAU/USD-BID-Tag 2024-08-01 vollständig gegen den offiziellen Widget-CSV-Export verifiziert (1.380 Kerzen, 0 Abweichungen).
7. Alle Ablationen und Sensitivitäten liefen nur auf IS + Walk-forward. Danach wurde die Auswahl in \`generated/selected_config_freeze.json\` gehasht.
8. Erst danach lief die eingefrorene Variante auf der finalen OOS-Periode. Alle ${trialSummary.totalTests} Kandidaten-/Ablations-/OOS-Tests sowie die getrennten Trades der finalen Variante stehen in \`MRWAGWAN_HYBRID_BACKTESTS.json\`.
9. Der für Phase 1 und OOS verwendete Source-Commit lautet \`${final.frozenSelection.repositorySourceCommit}\`; zusätzliche Eingabedateien sind im Freeze einzeln per SHA-256 gebunden.

## Daten- und Quellenhinweise

- Video: https://www.youtube.com/watch?v=AZlbhU1xG9A
- Dukascopy Historical Data Export: https://www.dukascopy.com/swiss/english/marketwatch/historical/
- Offizielles Exportwidget: https://widgets.dukascopy.com/en/historical-data-export
- Öffentlicher JETTA-Feed: https://jetta.dukascopy.com/v1
- BLS 2024/2025: https://www.bls.gov/schedule/2024/ und https://www.bls.gov/schedule/2025/
- FOMC: https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm
- ECB: https://www.ecb.europa.eu/press/press_conference/visual-mps/html/index.en.html

## Reproduktionsreihenfolge

1. \`node scripts/download_dukascopy_data.mjs\`
2. \`node scripts/run_phase1_ablation.mjs\`
3. Prüfen, dass \`generated/selected_config_freeze.json\` existiert und dessen Hash unverändert ist.
4. \`node scripts/run_phase2_oos.mjs\`
5. \`node scripts/render_reports.mjs\`
6. \`node scripts/validate_research.mjs\`

Die Phase-2-Datei darf nicht vor dem Freeze ausgeführt werden. Änderungen an Regeln oder Eventregister erfordern einen neuen Research-Zyklus mit neuer unberührter OOS-Periode.

## Probleme und Entscheidungen

- Der öffentliche Datenendpunkt drosselte parallele Requests (HTTP 429) und zeigte einen transienten Netzwerkfehler. Der Downloader wurde deshalb **vor** dem Test auf seriellen Abruf, Cache und äußere Retries umgestellt.
- Kostenlos reproduzierbare CME-NQ/ES-Bid/Ask-Daten standen nicht zur Verfügung; NASDAQ/SP500 werden klar als Dukascopy-CFD-Proxys markiert.
- Der Newsfilter enthält einen offiziell verifizierten Kern aus NFP, CPI, PPI, FOMC und ECB, aber kein vollständiges historisches Register für PCE, GDP, Retail Sales, ISM oder ungeplante Meldungen. News-Auswertungen gelten nur für den erfassten Ereignissatz.
- Das Video definiert weder Pivotbreite noch FVG-Geometrie, Sweep-Schwelle, Risikoprozent oder Newsregel. Diese Teile stammen aus der preregistrierten MrWagwan-Hybriddefinition und werden nicht dem Video zugeschrieben.
- Die Stop-Erweiterung und „Full Pot“-Sprache des Videos wurden aus Risiko- und Reproduzierbarkeitsgründen verworfen.

## Completion Gate

- Research-Tests >=1.000: **${minTotal ? 'PASS' : 'FAIL'}** (${trialSummary.totalTests})
- Research-Tests je Markt >=200: **${minEach ? 'PASS' : 'FAIL'}** (${Object.entries(trialSummary.byMarket).map(([k, v]) => `${k} ${v}`).join(', ')})
- Trades der final ausgewählten Variante: **${final.summary.all.trades}** (separat, nicht mit Varianten vermischt)
- Artefakt-/Datenvalidator: **${validation?.status ?? 'noch nicht ausgeführt'}**
- Strategiestatus: **${strategyStatus}**

## Handoff für ChatGPT

Verwende ausschließlich die eingefrorene Regelversion **${final.strategyVersion}** und behandle sie als **${strategyStatus}**. Die vollständige Evidenz aus ${trialSummary.totalTests} Research-Tests und ${final.summary.all.trades} getrennten Trades der finalen Variante steht in \`MRWAGWAN_HYBRID_BACKTESTS.json\`; korrelierte Varianten niemals zu einer Performancezahl aggregieren. Videoextraktion, Regelvergleich, Ablationen und Marktvergleich liegen in den gleichnamigen Markdown-Dateien. Keine Live-Order, kein Alert und keine Positionsgrößenempfehlung wurde erzeugt. Entscheidend sind Final-OOS-Erwartungswert ${n(oos.expectancyR)}R, PF ${n(oos.profitFactor)}, ${oos.trades} OOS-Trades und ${nonNegative}/5 nicht-negative OOS-Märkte. NASDAQ/SP500 sind CFD-Proxys, nicht CME-Futures. Bei jeder späteren Änderung neue Regeln preregistrieren und eine neue unberührte OOS-Periode verwenden; niemals dieses OOS nachoptimieren.
`;

const resultAppendix = `<!-- GENERATED_RESULTS_START -->
## 14. Generierter Ergebnisanhang

Erzeugt: ${final.generatedAt}  
Eingefrorene Regelversion: \`${final.strategyVersion}\`  
Status: **${strategyStatus}**

Research-Testabdeckung: **${trialSummary.totalTests} vollständige Tests**, davon ${Object.entries(trialSummary.byMarket).map(([k, v]) => `${k} ${v}`).join(', ')}. Diese Tests enthalten korrelierte Varianten und sind keine gemeinsame Performance-Stichprobe. Die final ausgewählte Variante erzeugte ${final.summary.all.trades} Trades über den Gesamtzeitraum.

| Segment | Trades | Win-Rate | Gesamt-R | Ø R | Profit Factor | Max Drawdown R |
|---|---:|---:|---:|---:|---:|---:|
| Gesamt | ${final.summary.all.trades} | ${pct(final.summary.all.winRate)} | ${n(final.summary.all.totalR)} | ${n(final.summary.all.expectancyR)} | ${n(final.summary.all.profitFactor)} | ${n(final.summary.all.maxDrawdownR)} |
| In-Sample | ${final.summary.is.trades} | ${pct(final.summary.is.winRate)} | ${n(final.summary.is.totalR)} | ${n(final.summary.is.expectancyR)} | ${n(final.summary.is.profitFactor)} | ${n(final.summary.is.maxDrawdownR)} |
| Walk-forward | ${final.summary.walkForward.trades} | ${pct(final.summary.walkForward.winRate)} | ${n(final.summary.walkForward.totalR)} | ${n(final.summary.walkForward.expectancyR)} | ${n(final.summary.walkForward.profitFactor)} | ${n(final.summary.walkForward.maxDrawdownR)} |
| Final OOS | ${final.summary.finalOos.trades} | ${pct(final.summary.finalOos.winRate)} | ${n(final.summary.finalOos.totalR)} | ${n(final.summary.finalOos.expectancyR)} | ${n(final.summary.finalOos.profitFactor)} | ${n(final.summary.finalOos.maxDrawdownR)} |

### Marktweise Final-OOS-Ergebnisse

| Markt | Trades | Win-Rate | Gesamt-R | Ø R | PF | Max DD R |
|---|---:|---:|---:|---:|---:|---:|
${Object.entries(final.summary.perMarket).map(([market, x]) => `| ${market} | ${x.finalOos.trades} | ${pct(x.finalOos.winRate)} | ${n(x.finalOos.totalR)} | ${n(x.finalOos.expectancyR)} | ${n(x.finalOos.profitFactor)} | ${n(x.finalOos.maxDrawdownR)} |`).join('\n')}

### Bekannte Schwächen

- Nur eine Zwölfmonatsprobe; selbst positive OOS-Werte sind keine Live-Validierung.
- NASDAQ und S&P 500 sind Dukascopy-CFD-Proxys statt CME NQ/ES.
- Der Red-News-Filter ist auf den verifizierten Kern NFP/CPI/PPI/FOMC/ECB beschränkt.
- Algorithmische SMC-Proxys bilden diskretionäre Struktur-, FVG- und Order-Block-Lesarten nur näherungsweise ab.
- Bid/Ask wurde beobachtet; Slippage und Commission bleiben modellierte Annahmen.

Vollständige Kennzahlen, Ablationen, Sensitivität, Einzeldaten und Einschränkungen stehen in \`MRWAGWAN_HYBRID_RESULTS.md\`, \`MRWAGWAN_ABLATION_RESULTS.md\` und \`MRWAGWAN_HYBRID_BACKTESTS.json\`.
<!-- GENERATED_RESULTS_END -->`;

await writeFile(new URL('MRWAGWAN_HYBRID_RESULTS.md', ROOT), results, 'utf8');
await writeFile(new URL('MRWAGWAN_ABLATION_RESULTS.md', ROOT), ablation, 'utf8');
await writeFile(new URL('MRWAGWAN_MARKET_COMPARISON.md', ROOT), marketComparison, 'utf8');
await writeFile(new URL('MRWAGWAN_RESEARCH_LOG.md', ROOT), log, 'utf8');
const strategyUrl = new URL('MRWAGWAN_HYBRID_STRATEGY.md', ROOT);
const strategyText = await readFile(strategyUrl, 'utf8');
if (!strategyText.includes('<!-- GENERATED_RESULTS_START -->') || !strategyText.includes('<!-- GENERATED_RESULTS_END -->')) throw new Error('Strategy result markers missing');
await writeFile(strategyUrl, strategyText.replace(/<!-- GENERATED_RESULTS_START -->[\s\S]*?<!-- GENERATED_RESULTS_END -->/, resultAppendix), 'utf8');
process.stdout.write(`Reports rendered; strategy status: ${strategyStatus}\n`);
