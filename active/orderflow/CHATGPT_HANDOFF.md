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

Research-Framework, Quellenledger, Glossar, Lernplan, zehn Setup-Hypothesen und die praktisch geprüfte Indikatordokumentation sind angelegt. CORE sind Datenintegrität, Auction-Kontext, Trennung von ausgeführtem/ruhendem Flow, Aggression relativ zu Preisfortschritt, Follow-through, No Trade und outcome-blinde Tests. Kein konkretes Setup ist profitabel validiert.

## Quellenbasis

CME, TradingView und Sierra Chart für technische Definitionen; Cont/Kukanov/Stoikov für akademische Mikrostruktur; Jim Dalton/FuturesTrader71 für Auction/Profil; Bookmap, Axia Futures, Jigsaw, John Grady und SMB für Lehrbeispiele. Creator-Profitabilität ist nicht unabhängig verifiziert.

## Technische Datenlage

- TradingView Desktop MCP: verbunden über `127.0.0.1:9222`.
- aktueller Chart: `CME_MINI_DL:NQ1!`, 5m, natives Session-VWAP + natives CVD.
- persönliche Indikatorvorlage: `MRWAGWAN_ORDERFLOW_CORE`; Symbol und Intervall nicht mitgespeichert; Layout nicht gespeichert/überschrieben.
- eingeloggtes TradingView-Abo im Test: `Basic`; frühere Essential-Annahme ist veraltet.
- VWAP/CVD: auf GC, NQ, ES, 6E, Coinbase BTCUSD und Binance BTC-Perpetual berechnet.
- Futures: `_DL`, praktisch rund zehn Minuten verzögert; nicht für zeitkritische Live-Orderflow-/Newsentscheidungen.
- CVD: TradingView-Intrabar-Schätzung, kein verifizierter Roh-Bid/Ask-Feed.
- Open Interest: NQ Daily praktisch verfügbar; nicht Teil des 5m-Kerns.
- Volume Profile/TPO: durch Basic→Premium gesperrt.
- DOM: MCP-Werkzeug vorhanden, Panel/Broker-Tier-2 aktuell nicht verfügbar.
- Native Footprint-/TPO-Charttypen, Time & Sales, historische Ticks/Depth: nicht über aktuelles MCP verfügbar.

## Verbindlicher Pre-Trade-Check

1. Ist die Analyse ausschließlich aus Orderflow/Auction begründet?
2. Ist der benötigte Feed tatsächlich vorhanden und dokumentiert?
3. Sind alte ICT-/SMC-Komponenten vollständig entfernt?

Bei Nein: Analyse stoppen. Ausgabe: **„Diese Orderflow-Information ist mit dem aktuellen Feed nicht verifizierbar.“**

## Nächster sinnvoller Schritt

Zuerst `OF_TRAINING_001` als Daten-/Grundlagenübung mit dem klar als verzögert/geschätzt gekennzeichneten NQ-Kern starten. Parallel ist der sinnvollste technische Ausbau: CME-Echtzeitdaten und danach Volume Profile freischalten. Footprint/DOM/Tape erst mit verifiziertem Tick-/BidAsk-/Depth-Zugang; noch kein Performance-Backtest.

## Offene Research-Fragen

- Welcher CME-Echtzeit-/Historienfeed soll rechtmäßig ergänzt werden? Aktuell ist nur `_DL` bestätigt.
- Lassen sich native TradingView-Footprint-Zellen reproduzierbar exportieren oder per MCP lesen?
- Welche Plattform liefert rechtmäßig historische Depth und Time & Sales für outcome-blinde Replays?
- Welche Setup-Schwellen bleiben nach Kosten, Walk-Forward und OOS stabil?
