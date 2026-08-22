# MrWagwan Hybrid — Ablation und Robustheit

Wichtig: **Alle Werte in diesem Dokument enden vor dem finalen OOS am 2025-05-01.** Sie dienen der Regelprüfung und Variantenwahl; kein OOS-Ergebnis wurde zur Auswahl verwendet.

| Variante | Typ | IS Trades | IS ØR | IS PF | WF Trades | WF ØR | WF PF | Δ WF ØR vs Basis | Auswahlhürde erfüllt |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| MRWAGWAN_V3_REFERENCE_PROXY | Sensitivität | 148 | -0.19 | 0.61 | 70 | -0.05 | 0.88 | -0.53 | NEIN |
| BASE_HYBRID_PREREG_1_0 | Basis | 43 | -0.31 | 0.49 | 22 | 0.49 | 2.48 | 0.00 | NEIN |
| ABL_NO_FVG | Ablation | 122 | -0.43 | 0.40 | 65 | -0.08 | 0.85 | -0.57 | NEIN |
| ABL_MARKET_ENTRY | Ablation | 142 | -0.16 | 0.67 | 50 | -0.14 | 0.70 | -0.63 | NEIN |
| ABL_POI_REQUIRED | Ablation | 1 | 0.59 | n/a | 4 | 0.84 | n/a | 0.36 | NEIN |
| ABL_EXTERNAL_ONLY | Ablation | 18 | -0.21 | 0.61 | 11 | 0.32 | 1.92 | -0.16 | NEIN |
| ABL_NO_H1_BIAS | Ablation | 129 | -0.32 | 0.48 | 62 | -0.03 | 0.94 | -0.52 | NEIN |
| ABL_COUNTERTREND | Ablation | 43 | -0.31 | 0.49 | 22 | 0.49 | 2.48 | 0.00 | NEIN |
| ABL_H4_BIAS | Ablation | 32 | -0.32 | 0.49 | 18 | 0.26 | 1.65 | -0.23 | NEIN |
| ABL_NEWS_NONE | Ablation | 47 | -0.32 | 0.50 | 24 | 0.35 | 1.87 | -0.14 | NEIN |
| ABL_NEWS_30 | Ablation | 43 | -0.31 | 0.49 | 22 | 0.49 | 2.48 | 0.00 | NEIN |
| ABL_NEWS_120 | Ablation | 41 | -0.27 | 0.54 | 22 | 0.49 | 2.48 | 0.00 | NEIN |
| ABL_NEWS_DAY | Ablation | 39 | -0.31 | 0.49 | 21 | 0.58 | 3.07 | 0.09 | NEIN |
| ABL_NO_TARGET_SPACE | Ablation | 111 | -0.29 | 0.49 | 57 | -0.01 | 0.98 | -0.50 | NEIN |
| ABL_V_REACTION | Ablation | 35 | -0.40 | 0.41 | 18 | 0.54 | 2.87 | 0.06 | NEIN |
| DIAG_FREQUENCY_SIMPLIFIED_MSS | Sensitivität | 783 | -0.20 | 0.61 | 329 | -0.20 | 0.61 | -0.68 | NEIN |
| SENS_SWEEP_002 | Sensitivität | 44 | -0.30 | 0.50 | 22 | 0.49 | 2.48 | 0.00 | NEIN |
| SENS_SWEEP_004 | Sensitivität | 42 | -0.29 | 0.52 | 21 | 0.43 | 2.26 | -0.05 | NEIN |
| SENS_DISPLACEMENT_040 | Sensitivität | 50 | -0.28 | 0.53 | 21 | 0.49 | 2.68 | 0.01 | NEIN |
| SENS_DISPLACEMENT_060 | Sensitivität | 36 | -0.39 | 0.41 | 20 | 0.43 | 2.20 | -0.06 | NEIN |
| SENS_STOP_BUFFER_010 | Sensitivität | 43 | -0.37 | 0.43 | 23 | 0.50 | 2.58 | 0.02 | NEIN |
| SENS_STOP_BUFFER_020 | Sensitivität | 40 | -0.33 | 0.47 | 19 | 0.42 | 2.29 | -0.07 | NEIN |

## Auswahl

Eingefroren wurde **BASE_HYBRID_PREREG_1_0**. Keine Ablation überwand alle preregistrierten Hürden; deshalb blieb die Basis ausgewählt.

## Regelinterpretation

- **FVG:** `ABL_NO_FVG` isoliert die Pflicht eines echten Drei-Candle-Gaps.
- **1m-Retest:** `ABL_MARKET_ENTRY` misst den Preis für die strengere Retest-Bedingung in verpassten bzw. zusätzlichen Trades.
- **Video-POI:** `ABL_POI_REQUIRED` prüft, ob die objektivierte Origin-/Mitigation-Zone Mehrwert bringt.
- **Liquiditätsart:** `ABL_EXTERNAL_ONLY` trennt vorige Session-Levels von internen Pivots.
- **Bias/Countertrend:** `ABL_NO_H1_BIAS`, `ABL_COUNTERTREND` und `ABL_H4_BIAS` testen Kontextregeln getrennt.
- **News:** `ABL_NEWS_NONE/30/120/DAY` verändern nur das Eventfenster relativ zur 60-Minuten-Basis.
- **Target-Room und V-Reaktion:** testen die beiden direkt aus dem Video abgeleiteten Filter.
- **Frequenzdiagnose:** `DIAG_FREQUENCY_SIMPLIFIED_MSS` kombiniert ausnahmsweise drei Lockerungen (kein FVG-Zwang, Market-Entry, kein Target-Room), ist aber ausdrücklich nicht auswählbar und wird nie zur finalen Performancebehauptung verwendet.

## Video-Regeln einzeln

| Video-Regel | Tests | Baseline-Ergebnis | Ergebnis mit Regel | Veränderung | Entscheidung |
|---|---:|---:|---:|---:|---|
| Video-POI/Origin-Mitigation als Pflicht | 4 | 0.49R / PF 2.48 | 0.84R / PF n/a | 0.36R | 🧪 weitere Daten erforderlich |
| 1m-FVG-Retest statt sofortigem Market-Entry | 22 | -0.14R / PF 0.70 | 0.49R / PF 2.48 | 0.63R | 🧪 weitere Daten erforderlich |
| Countertrend nur an externer SSL/BSL + POI | 22 | 0.49R / PF 2.48 | 0.49R / PF 2.48 | 0.00R | 🧪 weitere Daten erforderlich |
| Mindestens 1R Raum bis bekannter Gegenliquidität | 22 | -0.01R / PF 0.98 | 0.49R / PF 2.48 | 0.50R | 🧪 weitere Daten erforderlich |
| V-Reclaim innerhalb zwei 5m-Kerzen | 18 | 0.49R / PF 2.48 | 0.54R / PF 2.87 | 0.06R | 🧪 weitere Daten erforderlich |
| 5m-Drei-Candle-FVG als Pflicht | 22 | -0.08R / PF 0.85 | 0.49R / PF 2.48 | 0.57R | 🧪 weitere Daten erforderlich |
| Stop nach Entry weiter weg setzen | 0 | technischer Stop vor Entry | nicht getestet | n/a | ❌ verwerfen (Risikoerhöhung; Sicherheitsregel, kein Optimierungskandidat) |
| „Full Pot“-/Recovery-Risiko | 0 | 1R / illustrativ 1% Modellrisiko | nicht getestet | n/a | ❌ verwerfen (unvertretbares Risikomodell) |

## Parameterstabilität

Die `SENS_*`-Zeilen sind absichtlich nicht auswählbar. Ein Vorzeichenwechsel bei kleinen Änderungen von Sweep-, Displacement- oder Stop-Puffer-Schwelle ist ein Warnsignal für Instabilität. Selbst ein glatter lokaler Bereich beseitigt nicht das Risiko, dass die gesamte Regelklasse an dieses einzelne Jahr angepasst ist.

## Multiple Testing / Overfitting

Es wurden 21 Abweichungen von der Basis angesehen. Deshalb gilt ein optisch besserer Mittelwert nicht als Beweis. Die Auswahlhürde verlangt einen deutlichen WF-Abstand, Mindeststichprobe, positives IS und marktübergreifende Konsistenz; Ablationen werden für die Auswahl nicht kombiniert. Die einzige kombinierte Frequenzdiagnose ist nicht auswählbar. Das finale OOS wurde erst nach Hash-Freeze der Auswahl ausgeführt.
