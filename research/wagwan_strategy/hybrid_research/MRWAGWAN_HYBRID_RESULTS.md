# MrWagwan Hybrid — Backtest-Ergebnisse

Stand: 2026-08-22T15:41:03.000Z

Regelversion: `BASE_HYBRID_PREREG_1_0`

Preregistered source commit: `1564d5a1cec61ceef32dc772fd695b20e2637a89`
Status: **NOT VALIDATED**

## Harte Aussage

Die vorab eingefrorene Variante erfüllt die preregistrierten OOS-Mindestbedingungen nicht. Es gibt damit keinen belastbaren Nachweis eines handelbaren Vorteils.

Der Backtest verwendet historische 1m-Bid-/Ask-Kerzen, adverse Slippage, Stop-first bei intraminütiger Ambiguität, exakt abgegrenzte Berlin-Sessions und einen einmaligen finalen OOS-Lauf. NASDAQ/SP500 sind Dukascopy-CFD-Proxys, nicht CME NQ/ES.

## Research-Testabdeckung

Es wurden **2998 vollständige Tests** gespeichert: 2975 IS/WF-Kandidaten-/Ablationstrades und 23 Trades der eingefrorenen Variante im finalen OOS. Varianten auf derselben Marktbewegung sind korreliert; diese Zahl belegt Testabdeckung und darf nicht als unabhängige Gesamtperformance interpretiert werden.

| Markt | vollständige Research-Tests |
|---|---:|
| XAUUSD | 563 |
| BTCUSD | 680 |
| NASDAQ | 592 |
| SP500 | 455 |
| EURUSD | 708 |

## Gesamt und Zeit-Splits

| Segment | Trades | Win-Rate | Ø R | Gesamt-R | PF | Max DD R | Ø MFE R | Ø MAE R |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Gesamt | 88 | 43.2% | -0.19 | -17.13 | 0.66 | 18.01 | 0.95 | -0.83 |
| In-Sample | 43 | 39.5% | -0.31 | -13.26 | 0.49 | 15.37 | 0.85 | -0.90 |
| Walk-forward | 22 | 63.6% | 0.49 | 10.71 | 2.48 | 4.39 | 1.55 | -0.64 |
| Final OOS | 23 | 30.4% | -0.63 | -14.58 | 0.14 | 15.11 | 0.58 | -0.89 |

95%-Intervall des finalen OOS-Erwartungswerts: **-0.94R bis -0.33R**. Dieses Intervall zeigt Stichprobenunsicherheit; es ist keine Gewinnprognose.

### Vollständige Kernstatistik der ausgewählten Variante

| Kennzahl | Gesamt | Final OOS |
|---|---:|---:|
| Wins / Losses / Break-even | 38 / 49 / 1 | 7 / 16 / 0 |
| Win-Rate | 43.2% | 30.4% |
| Netto-R | -17.13 | -14.58 |
| Erwartungswert / Median R | -0.19 / -0.43 | -0.63 / -1.04 |
| Profit Factor | 0.66 | 0.14 |
| Ø Gewinner / Ø Verlust R | 0.88 / -1.03 | 0.35 / -1.06 |
| Max Drawdown / max. Verlustserie | 18.01 / 7 | 15.11 / 7 |
| Ø MFE / Ø MAE R | 0.95 / -0.83 | 0.58 / -0.89 |
| Ø Haltedauer Minuten | 66.4 | 64.6 |
| TP1 / TP2 / TP3 Hit-Rate | 37.5% / 15.9% / 5.7% | 17.4% / 0.0% / 0.0% |

## Marktweise Ergebnisse

| Markt | Gesamt Trades | Gesamt ØR | Gesamt PF | OOS Trades | OOS Win-Rate | OOS ØR | OOS PF | OOS Max DD R |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| XAUUSD | 19 | -0.34 | 0.41 | 4 | 50.0% | -0.37 | 0.31 | 1.78 |
| BTCUSD | 17 | -0.56 | 0.34 | 6 | 33.3% | -0.62 | 0.22 | 3.74 |
| NASDAQ | 19 | -0.24 | 0.64 | 6 | 0.0% | -1.11 | 0.00 | 6.63 |
| SP500 | 9 | -0.11 | 0.71 | 3 | 66.7% | -0.26 | 0.28 | 1.07 |
| EURUSD | 24 | 0.18 | 1.44 | 4 | 25.0% | -0.49 | 0.18 | 2.41 |

## Session- und Regimevergleich (gesamter eingefrorener Lauf)

### Sessions

| Segment | Trades | Win-Rate | Ø R | Gesamt-R | PF | Max DD R | Ø MFE R | Ø MAE R |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Asia | 41 | 36.6% | -0.40 | -16.44 | 0.42 | 16.87 | 0.77 | -0.96 |
| London | 36 | 47.2% | -0.08 | -3.01 | 0.84 | 7.17 | 1.06 | -0.76 |
| NewYork | 11 | 54.5% | 0.21 | 2.32 | 1.68 | 1.65 | 1.30 | -0.57 |

### Long vs. Short

| Segment | Trades | Win-Rate | Ø R | Gesamt-R | PF | Max DD R | Ø MFE R | Ø MAE R |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| short | 46 | 45.7% | -0.15 | -6.95 | 0.72 | 8.49 | 1.03 | -0.75 |
| long | 42 | 40.5% | -0.24 | -10.18 | 0.60 | 10.71 | 0.87 | -0.92 |

### Volatilität

| Segment | Trades | Win-Rate | Ø R | Gesamt-R | PF | Max DD R | Ø MFE R | Ø MAE R |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| unknown | 1 | 100.0% | 0.35 | 0.35 | n/a | 0.00 | 1.44 | -0.21 |
| normal | 63 | 47.6% | -0.14 | -8.70 | 0.75 | 11.36 | 1.01 | -0.84 |
| high | 14 | 21.4% | -0.43 | -6.08 | 0.38 | 6.08 | 0.78 | -0.79 |
| low | 10 | 40.0% | -0.27 | -2.70 | 0.56 | 4.35 | 0.79 | -0.88 |

### Strukturregime

| Segment | Trades | Win-Rate | Ø R | Gesamt-R | PF | Max DD R | Ø MFE R | Ø MAE R |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| trending | 76 | 39.5% | -0.25 | -19.15 | 0.59 | 20.04 | 0.93 | -0.87 |
| sideways | 12 | 66.7% | 0.17 | 2.03 | 1.63 | 2.21 | 1.09 | -0.60 |

### Risk-on/Risk-off-Proxy

Nur BTCUSD/NASDAQ/SP500 werden deskriptiv klassifiziert: bullish 1H = `risk_on_proxy`, bearish 1H = `risk_off_proxy`. Für XAUUSD/EURUSD wird kein makroökonomischer Zustand aus Preisrichtung erfunden.

| Segment | Trades | Win-Rate | Ø R | Gesamt-R | PF | Max DD R | Ø MFE R | Ø MAE R |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| risk_off_proxy | 23 | 34.8% | -0.44 | -10.12 | 0.37 | 10.54 | 0.83 | -0.78 |
| unclassified | 43 | 51.2% | -0.05 | -2.17 | 0.89 | 6.79 | 1.08 | -0.85 |
| risk_on_proxy | 22 | 36.4% | -0.22 | -4.84 | 0.65 | 6.40 | 0.83 | -0.85 |

### Monate

| Segment | Trades | Win-Rate | Ø R | Gesamt-R | PF | Max DD R | Ø MFE R | Ø MAE R |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 2024-08 | 4 | 25.0% | -0.81 | -3.25 | 0.10 | 3.59 | 0.78 | -0.95 |
| 2024-09 | 6 | 33.3% | -0.16 | -0.95 | 0.61 | 1.41 | 0.97 | -0.83 |
| 2024-10 | 6 | 50.0% | -0.22 | -1.32 | 0.64 | 2.46 | 1.00 | -0.76 |
| 2024-11 | 11 | 45.5% | -0.19 | -2.12 | 0.63 | 2.55 | 0.71 | -0.83 |
| 2024-12 | 9 | 33.3% | -0.42 | -3.80 | 0.43 | 5.00 | 0.98 | -1.05 |
| 2025-01 | 7 | 42.9% | -0.26 | -1.83 | 0.56 | 3.59 | 0.72 | -0.96 |
| 2025-02 | 4 | 50.0% | 0.55 | 2.20 | 3.03 | 1.10 | 1.72 | -0.64 |
| 2025-03 | 6 | 83.3% | 0.94 | 5.63 | 6.49 | 1.03 | 1.84 | -0.68 |
| 2025-04 | 12 | 58.3% | 0.24 | 2.89 | 1.56 | 4.39 | 1.34 | -0.62 |
| 2025-05 | 6 | 16.7% | -0.84 | -5.03 | 0.08 | 5.03 | 0.42 | -0.98 |
| 2025-06 | 10 | 30.0% | -0.58 | -5.76 | 0.20 | 6.45 | 0.65 | -0.90 |
| 2025-07 | 7 | 42.9% | -0.54 | -3.79 | 0.14 | 4.33 | 0.61 | -0.79 |

## News-Effekt

Die Basis blockiert Entries +/-60 Minuten um den verifizierten Kern aus FOMC-, CPI-, PPI-, NFP- und für EURUSD ECB-Entscheidungen. Ein reiner Vergleich von Event- zu Nicht-Event-Tagen ist nicht kausal, weil der Filter gerade die unmittelbare Releasezone entfernt. Das Register ist ausdrücklich nicht vollständig: PCE, GDP, Retail Sales, ISM sowie ungeplante Red-News/Reden fehlen in diesem Lauf.

| Segment | Trades | Win-Rate | Ø R | Gesamt-R | PF | Max DD R | Ø MFE R | Ø MAE R |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| non_event_day | 80 | 45.0% | -0.14 | -11.01 | 0.75 | 14.28 | 0.98 | -0.82 |
| event_day | 8 | 25.0% | -0.77 | -6.12 | 0.15 | 6.12 | 0.65 | -0.93 |

Die kausalere Ein-Regel-Ablation (kein Filter / 30 / 60 / 120 Minuten / ganzer Tag) steht in `MRWAGWAN_ABLATION_RESULTS.md` und wurde nur auf IS + Walk-forward ausgewertet.

## Stichproben- und Freigabekriterien

| Kriterium | Ergebnis |
|---|---|
| >=1.000 vollständige Research-Tests | PASS (2998) |
| >=200 Research-Tests je Markt | PASS (XAUUSD 563, BTCUSD 680, NASDAQ 592, SP500 455, EURUSD 708) |
| Trades der final ausgewählten Variante | INFO (88; nicht künstlich erhöht) |
| OOS ØR > 0 | FAIL (-0.63R) |
| OOS PF > 1,05 | FAIL (0.14) |
| Final OOS >=100 Trades und >=10 je Markt | FAIL (23; XAUUSD 4, BTCUSD 6, NASDAQ 6, SP500 3, EURUSD 4) |
| >=3/5 OOS-Märkte nicht-negativ | FAIL (0/5) |
| Kein Markt >60% positiver OOS-Beitrag | FAIL (100.0%) |
| Kein WF-Vorzeichenwechsel in preregistrierten Parameter-Nachbarschaften | PASS |

## Einschränkungen

- Der Zeitraum umfasst exakt zwölf Monate, aber nur **eine** historische Jahresprobe.
- CFD-Proxys können Futures-Session, Roll, Liquidität und Kosten nicht identisch abbilden.
- Dukascopy-Bid/Ask ist eine Datenquelle; modellierte Zusatzslippage ist keine Garantie echter Fills.
- Der offizielle EURUSD-Widget-Export enthält am 2024-10-09/10 selbst 164 gekreuzte Bid/Ask-Minuten und 774 geometrisch unplausible OHLC-Minuten. Alle vier BID/ASK-Tagesdateien stimmen exakt mit dem Decoder überein. Die Werte wurden nicht heimlich repariert; zwei Entwicklungs-/Diagnosetrades überlappen direkt, aber kein Trade der eingefrorenen Basis und kein OOS-Trade. Details: `SOURCE_DATA_ANOMALY_AUDIT.md`.
- FVG, Pivots, Origin-Zonen und MSS sind algorithmische Stellvertreter für diskretionäre SMC-Lesarten.
- Die Videostrategie basiert im Video im Wesentlichen auf einem Trade; ihre Regeln waren unvollständig und teils widersprüchlich.
- Viele getestete Ablationen erhöhen Multiple-Testing-Risiko. Der finale OOS blieb deshalb für die Auswahl gesperrt.
- Das Newsregister ist ein offiziell verifizierter Kernfilter, kein vollständiger historischer Wirtschaftskalender; News-/Nicht-News-Auswertungen sind deshalb nur für diesen Ereignissatz gültig.
- Finanzieller „erwarteter Profit“ wird in R berichtet. Bei rein illustrativem Modellrisiko 1% entspräche 1R etwa 1% des jeweiligen damaligen Modellkapitals; dies ist keine Prognose.
