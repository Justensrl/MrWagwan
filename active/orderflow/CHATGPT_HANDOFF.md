# ChatGPT Handoff — MrWagwan

**STRATEGY_STATUS: ORDERFLOW ONLY**
**Stand:** 2026-08-25

## Verbindlicher Zustand

- ICT, SMC, CRT, Silver Bullet und die alte MrWagwan-Hybridstrategie sind `ARCHIVED – NOT ACTIVE`.
- Alte Übungen 1–3 bleiben historisch; die unvollständige alte Übung 4 wird nicht fortgesetzt.
- Orderflow ist die einzige aktive Research-, Trainings- und spätere Backteststrategie.
- Neue Serie beginnt mit `OF_TRAINING_001`; Statistik: 0 Trades.
- Keine erzwungene Richtung: `No Trade` ist zulässig.
- Keine echten Trades, Orders, Alerts oder Pine-Veröffentlichungen.

## Aktueller Lernstand

Research-Framework, Quellenledger, Glossar, Lernplan und zehn Setup-Hypothesen sind angelegt. CORE sind nur Datenintegrität, Auction-Kontext, Trennung von ausgeführtem/ruhendem Flow, Aggression relativ zu Preisfortschritt, Follow-through, No Trade und outcome-blinde Tests. Kein konkretes Setup ist profitabel validiert.

## Quellenbasis

CME, TradingView und Sierra Chart für technische Definitionen; Cont/Kukanov/Stoikov für akademische Mikrostruktur; Jim Dalton/FuturesTrader71 für Auction/Profil; Bookmap, Axia Futures, Jigsaw, John Grady und SMB für Lehrbeispiele. Creator-Profitabilität ist nicht unabhängig verifiziert.

## Technische Datenlage

- TradingView Desktop MCP: verbunden über `127.0.0.1:9222`.
- OHLCV, Symbolmetadaten und Indikatorwerte: verfügbar.
- aktuelle Ansicht beim Audit: `TVC:USOIL` CFD, 4H; kein kanonischer zentraler Orderflow-Feed.
- Community-CVD: auslesbar, aber Intrabar-Schätzung und kein verifizierter Roh-Bid/Ask-Feed.
- DOM: MCP-Werkzeug vorhanden, Panel/Feed aktuell nicht verfügbar.
- Footprint-Zellen, Time & Sales, historische Ticks/Depth und echte Futures-Echtzeitberechtigung: nicht verifiziert bzw. nicht über MCP verfügbar.

## Verbindlicher Pre-Trade-Check

1. Ist die Analyse ausschließlich aus Orderflow/Auction begründet?
2. Ist der benötigte Feed tatsächlich vorhanden und dokumentiert?
3. Sind alte ICT-/SMC-Komponenten vollständig entfernt?

Bei Nein: Analyse stoppen. Ausgabe: **„Diese Orderflow-Information ist mit dem aktuellen Feed nicht verifizierbar.“**

## Nächster sinnvoller Schritt

Zuerst einen belastbaren zentralen Futures-Datensatz mit Tick-/BidAsk-Daten und optional historischer Depth bereitstellen beziehungsweise praktisch verifizieren. Danach `OF_TRAINING_001` als Daten-/Grundlagenübung starten; noch kein Performance-Backtest.

## Offene Research-Fragen

- Welcher CME-Echtzeit-/Historienfeed ist im Konto wirklich freigeschaltet?
- Lassen sich native TradingView-Footprint-Zellen reproduzierbar exportieren oder per MCP lesen?
- Welche Plattform liefert rechtmäßig historische Depth und Time & Sales für outcome-blinde Replays?
- Welche Setup-Schwellen bleiben nach Kosten, Walk-Forward und OOS stabil?
