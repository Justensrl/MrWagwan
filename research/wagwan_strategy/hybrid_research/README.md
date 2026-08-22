# MrWagwan Hybrid Research Bundle

Reproduzierbare, strikt historische Research-Pipeline für die Hybridisierung der bestehenden MrWagwan-Regeln mit den objektivierbaren Bestandteilen des Videos `AZlbhU1xG9A`.

## Sicherheitsstatus

Dieses Verzeichnis enthält nur Analyse-, Download- und Backtestcode. Es erzeugt keine Orders, keine Alerts, keine Pine-Veröffentlichung und verändert keinen TradingView-Chart. Ergebnisse sind keine Finanzberatung und keine Live-Freigabe.

## Artefakte

- `VIDEO_STRATEGY_EXTRACTION.md`: vollständige, zeitgestempelte Videoextraktion
- `VIDEO_VS_MRWAGWAN_COMPARISON.md`: KEEP/ADD/TEST/REJECT-Matrix
- `MRWAGWAN_HYBRID_STRATEGY.md`: vorab festgeschriebene mechanische Regeln
- `MRWAGWAN_HYBRID_BACKTESTS.json`: alle vollständigen IS/WF-Kandidaten-/Ablationstests, die separaten Trades der eingefrorenen Variante und deren Final-OOS-Statistiken; korrelierte Varianten werden nicht zu einer Performancezahl vermischt
- `MRWAGWAN_HYBRID_RESULTS.md`: Hauptresultat
- `MRWAGWAN_ABLATION_RESULTS.md`: IS/WF-Ablationen und Sensitivitäten
- `MRWAGWAN_MARKET_COMPARISON.md`: marktweiser Final-OOS-Vergleich
- `MRWAGWAN_RESEARCH_LOG.md`: Audit-Trail und Handoff
- `raw/`: Rohtranskript, Newsregister, komprimierte Bid/Ask-Daten und SHA-256-Manifest
- `scripts/`: Downloader, Backtestkern, getrennte Phase 1/Phase 2, Renderer und Validator

## Reproduktionsbarriere

Phase 1 endet am 2025-05-01 und schreibt einen Hash-Freeze. Phase 2 verweigert die Ausführung bei geändertem Config-Hash. Ablationen/Sensitivitäten werden nicht im finalen OOS ausgewählt oder kombiniert.

Nach dem ersten erfolgreichen Phase-2-Lauf bindet `generated/final_oos_execution.json` den Output-Hash und sperrt einen zweiten OOS-Lauf in demselben Audit-Workspace. Eine unabhängige Reproduktion erfolgt deshalb in einem frischen Worktree des im Freeze genannten Source-Commits; der Marker des abgeschlossenen Audits wird nicht gelöscht oder umgangen.

```powershell
pnpm run data
pnpm run phase1
pnpm run phase2
pnpm run reports
pnpm run validate
```

Der öffentliche Datenabruf kann Netzfreigabe benötigen. Der Downloader verwendet dieselben offiziellen, tagesweisen JETTA-Endpunkte wie das Dukascopy-Exportwidget, arbeitet strikt seriell, pausiert 900 ms zwischen Requests und legt fortsetzbare Tages-Caches an. `node_modules/` und der HTTP-Cache sind nicht Teil des Research-Artefakts; alle fachlich erforderlichen Eingaben, Quellcodes und Prüfsummen sind es.

## Datenprovenienz

- Dukascopy Bank Historical Data Export: https://www.dukascopy.com/swiss/english/marketwatch/historical/
- Offizielles Exportwidget: https://widgets.dukascopy.com/en/historical-data-export
- Öffentlicher JETTA-Endpunkt: `https://jetta.dukascopy.com/v1/candles/minute/{instrument}/{BID|ASK}/{year}/{month}/{day}`
- Decoder-Gegenprobe: Der komplette XAU/USD-BID-Tag 2024-08-01 wurde zeilenweise gegen den CSV-Export des offiziellen Widgets geprüft (1.380/1.380 Kerzen, 0 Abweichungen).
- NASDAQ/SP500: `USATECH.IDX-USD`/`USA500.IDX-USD` CFD-Proxys, keine CME-NQ/ES-Futures
- High-impact-Termine: offizielle BLS-, Federal-Reserve- und ECB-Kalender

Die verwendete Zusatzslippage ist ein konservativer Simulationsparameter und kein beobachteter Broker-Fill.
