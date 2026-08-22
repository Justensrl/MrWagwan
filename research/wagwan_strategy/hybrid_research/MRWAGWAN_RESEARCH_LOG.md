# MrWagwan Hybrid — Research Log und Handoff

## Durchgeführte Arbeit

1. Die vollständigen offiziellen YouTube-Auto-Captions (00:00–49:57) wurden exportiert und unverändert als Rohtext gespeichert.
2. Video, Beschreibung und sichtbare Chartsequenzen wurden getrennt als EXPLIZIT, ABGELEITET oder UNKLAR klassifiziert.
3. Bestehende MrWagwan-V3-, Session-, Risiko- und Marktberichte wurden gelesen; frühere Resultate wurden nicht als neue Evidenz umetikettiert.
4. Vor dem neuen Backtest wurden Vergleich, Hybridregeln, Daten-/Kostenmodell, Ablationen, Sensitivitäten, Auswahlhürde und OOS-Grenze schriftlich preregistriert.
5. Offizielle BLS-, Fed- und ECB-Kalender wurden auf einen konservativen Kern ausgewählter Hochrisikoereignisse reduziert; historische DST wurde in UTC-Zeitstempel umgerechnet. Fehlende PCE/GDP/Retail/ISM-Abdeckung ist ausdrücklich dokumentiert.
6. Zwölf Monate Dukascopy-1m-Bid/Ask-Daten wurden über die offiziellen seriellen JETTA-Tagesendpunkte mit Cache/Retry geladen, zusammengeführt, komprimiert, gehasht und auf Reihenfolge, Duplikate, Umfang und Spread geprüft. Der Decoder wurde am XAU/USD-BID-Tag 2024-08-01 vollständig gegen den offiziellen Widget-CSV-Export verifiziert (1.380 Kerzen, 0 Abweichungen). Zusätzlich wurden EURUSD BID/ASK für 2024-10-09/10 wegen einer quellseitigen Anomalie in allen 5.738 Widget-Zeilen exakt gegengeprüft (0 Abweichungen); der Befund steht in `SOURCE_DATA_ANOMALY_AUDIT.md`.
7. Alle Ablationen und Sensitivitäten liefen nur auf IS + Walk-forward. Danach wurde die Auswahl in `generated/selected_config_freeze.json` gehasht.
8. Erst danach lief die eingefrorene Variante auf der finalen OOS-Periode. Alle 2998 Kandidaten-/Ablations-/OOS-Tests sowie die getrennten Trades der finalen Variante stehen in `MRWAGWAN_HYBRID_BACKTESTS.json`.
9. Der für Phase 1 und OOS verwendete Source-Commit lautet `1564d5a1cec61ceef32dc772fd695b20e2637a89`; zusätzliche Eingabedateien sind im Freeze einzeln per SHA-256 gebunden.
10. Es gibt keine Zufallsauswahl und daher keinen Seed; gleiche Eingaben und derselbe Source-Commit führen deterministisch zum selben Lauf.
11. `generated/final_oos_execution.json` bindet den einmaligen OOS-Lauf an den SHA-256 des finalen JSON; Phase 2 verweigert in diesem Workspace jeden zweiten Lauf.

## Daten- und Quellenhinweise

- Video: https://www.youtube.com/watch?v=AZlbhU1xG9A
- Dukascopy Historical Data Export: https://www.dukascopy.com/swiss/english/marketwatch/historical/
- Offizielles Exportwidget: https://widgets.dukascopy.com/en/historical-data-export
- Öffentlicher JETTA-Feed: https://jetta.dukascopy.com/v1
- BLS 2024/2025: https://www.bls.gov/schedule/2024/ und https://www.bls.gov/schedule/2025/
- FOMC: https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm
- ECB: https://www.ecb.europa.eu/press/press_conference/visual-mps/html/index.en.html

## Reproduktionsreihenfolge

1. `node scripts/download_dukascopy_data.mjs`
2. `node scripts/run_phase1_ablation.mjs`
3. Prüfen, dass `generated/selected_config_freeze.json` existiert und dessen Hash unverändert ist.
4. `node scripts/run_phase2_oos.mjs`
5. `node scripts/render_reports.mjs`
6. `node scripts/validate_research.mjs`

Die Phase-2-Datei darf nicht vor dem Freeze ausgeführt werden. Änderungen an Regeln oder Eventregister erfordern einen neuen Research-Zyklus mit neuer unberührter OOS-Periode.

## Probleme und Entscheidungen

- Der öffentliche Datenendpunkt drosselte parallele Requests (HTTP 429) und zeigte einen transienten Netzwerkfehler. Der Downloader wurde deshalb **vor** dem Test auf seriellen Abruf, Cache und äußere Retries umgestellt.
- Der offizielle Dukascopy-EURUSD-Export weist am 2024-10-09/10 164 gekreuzte Bid/Ask-Minuten und 774 OHLC-Geometriefehler auf. Diese Quelleigenschaft wurde bytegetreu belegt, nicht korrigiert und als Warnung behandelt. Zwei nicht auswählbare Entwicklungs-/Diagnosetrades überlappen; finale OOS-Trades nicht.
- Kostenlos reproduzierbare CME-NQ/ES-Bid/Ask-Daten standen nicht zur Verfügung; NASDAQ/SP500 werden klar als Dukascopy-CFD-Proxys markiert.
- Der Newsfilter enthält einen offiziell verifizierten Kern aus NFP, CPI, PPI, FOMC und ECB, aber kein vollständiges historisches Register für PCE, GDP, Retail Sales, ISM oder ungeplante Meldungen. News-Auswertungen gelten nur für den erfassten Ereignissatz.
- Das Video definiert weder Pivotbreite noch FVG-Geometrie, Sweep-Schwelle, Risikoprozent oder Newsregel. Diese Teile stammen aus der preregistrierten MrWagwan-Hybriddefinition und werden nicht dem Video zugeschrieben.
- Die Stop-Erweiterung und „Full Pot“-Sprache des Videos wurden aus Risiko- und Reproduzierbarkeitsgründen verworfen.

## Completion Gate

- Research-Tests >=1.000: **PASS** (2998)
- Research-Tests je Markt >=200: **PASS** (XAUUSD 563, BTCUSD 680, NASDAQ 592, SP500 455, EURUSD 708)
- Trades der final ausgewählten Variante: **88** (separat, nicht mit Varianten vermischt)
- Artefakt-/Datenvalidator: **PASS**
- Strategiestatus: **NOT VALIDATED**

## Handoff für ChatGPT

Verwende ausschließlich die eingefrorene Regelversion **BASE_HYBRID_PREREG_1_0** und behandle sie als **NOT VALIDATED**. Die vollständige Evidenz aus 2998 Research-Tests und 88 getrennten Trades der finalen Variante steht in `MRWAGWAN_HYBRID_BACKTESTS.json`; korrelierte Varianten niemals zu einer Performancezahl aggregieren. Videoextraktion, Regelvergleich, Ablationen und Marktvergleich liegen in den gleichnamigen Markdown-Dateien. Keine Live-Order, kein Alert und keine Positionsgrößenempfehlung wurde erzeugt. Entscheidend sind Final-OOS-Erwartungswert -0.63R, PF 0.14, 23 OOS-Trades und 0/5 nicht-negative OOS-Märkte. NASDAQ/SP500 sind CFD-Proxys, nicht CME-Futures. Bei jeder späteren Änderung neue Regeln preregistrieren und eine neue unberührte OOS-Periode verwenden; niemals dieses OOS nachoptimieren.
