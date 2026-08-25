# Orderflow Research Log

## 2026-08-25 — Strategischer Reset

**Entscheidung:** `ORDERFLOW ONLY`. ICT/SMC/CRT/Silver Bullet und Hybridstrategie wurden logisch „in place“ archiviert, damit alte Prüfsummen und relative Pfade erhalten bleiben. Keine alte Statistik wurde übernommen.

### Geprüfte Quellencluster

- Exchange/Regulierung: CME Market by Order und Rule 575.
- Plattformmethodik: TradingView Footprint, Delta, Volume Profile, DOM; Sierra Numbers Bars, CVD und Time & Sales.
- Akademisch: Cont/Kukanov/Stoikov zur kurzfristigen Preiswirkung von Order-Book-Events.
- Auction/Profil: Jim Dalton, FuturesTrader71.
- Ausführung/DOM/Tape: Bookmap, Axia Futures, Jigsaw, John Grady; SMB ergänzend für Tape-Drills.

### Robuste gemeinsame Prinzipien → CORE

1. Datenherkunft bestimmt, was behauptet werden darf.
2. ausgeführtes Volumen und ruhende Liquidität sind verschiedene Informationsarten.
3. Aggression muss relativ zum erzielten Preisfortschritt gelesen werden.
4. Value, Acceptance/Rejection und Auction-Zustand liefern den Kontext.
5. Follow-through ist wichtiger als das isolierte Auftreten eines Musters.
6. No Trade ist valide.

### Widersprüche / offene Punkte

- TradingView schätzt Footprint/Delta aus Intrabars; Sierra dokumentiert echtes historisches Bid-/Ask-Volumen als Voraussetzung für echtes CVD. Deshalb werden TradingView-Werte nicht ungeprüft als exchange-seitige Aggressor-Daten bezeichnet.
- Resting DOM kann Information liefern, ist wegen Pulling, Stacking, Icebergs und Spoofing aber flüchtig. Ausführung und Reaktion müssen bestätigen.
- Educators verwenden unterschiedliche Imbalance-Schwellen, Profile und CVD-Resets. Keine Schwelle wird übernommen, bevor sie präregistriert getestet ist.
- „Finished/unfinished auction“ ist plattform- und Datenqualitätsabhängig; Definition vor Test festlegen.
- Aktuelle TradingView-/MCP-Umgebung hat keine verifizierte historische Tick-/Depth-Quelle.

### Hypothesen → CANDIDATE

- Absorption plus Gegen-Follow-through an Value-Rand.
- Value-Area-Rejection mit Rückakzeptanz.
- Value-Area-Acceptance plus Value-Migration.
- Initiative Breakout mit Folgevolumen.
- Delta-Divergenz nur als sekundäre Evidenz.

### REJECTED

- Delta-Vorzeichen als Richtung.
- großes Volumen als Entry.
- einzelne DOM-Wand als sichere Liquidität.
- Community-Footprint auf CFD als echter zentraler Footprint.
- Mischung mit archivierten ICT-/SMC-Komponenten.

### NEEDS MORE DATA

- Stacked Imbalance, Trapped Traders, echte Absorption und DOM-Pulling/Stacking benötigen exportierbare Tick-/BidAsk-/Depth-Daten.
- Futures-Echtzeitberechtigungen und Account-Entitlements müssen praktisch geprüft werden.
- Time & Sales ist über den aktuellen MCP nicht zugänglich.

### Nächste Research-Aktion

Einen rechtmäßig verfügbaren, dokumentierten CME-Futures-Datensatz mit Tick-, Bid/Ask- und möglichst Depth-Historie beschaffen oder eine Plattform anbinden, die diese Daten exportierbar liefert. Erst danach Testprotokoll präregistrieren.

## 2026-08-25 — Indikator-, Feed- und Template-Audit

### OWN RESEARCH — praktisch bestätigt

- TradingView-Konto meldete `Basic`, nicht Essential.
- `MRWAGWAN_ORDERFLOW_CORE` wurde als neue Indikatorvorlage erstellt; vorher waren keine persönlichen Indikatorvorlagen vorhanden.
- Kern: natives Session-VWAP (`Session`, `hlc3`, Bänder aus) plus natives CVD (`1D`, `Time`, Intrabar 1m).
- VWAP und CVD lieferten auf `COMEX:GC1!`, `CME_MINI:NQ1!`, `CME_MINI:ES1!`, `CME:6E1!`, `COINBASE:BTCUSD` und `BINANCE:BTCUSDT.P` nichtleere Werte.
- Futures wurden als `_DL` aufgelöst; Quotezeitstempel belegten rund zehn Minuten Delay.
- NQ Open Interest lieferte auf Daily `298,2K`.
- Session Volume Profile und TPO öffneten bei freiem Indikatorplatz eine Basic→Premium-Sperre.
- Native Footprint-/TPO-Charttypen sind in der MCP-Charttyp-API nicht vorhanden.
- DOM scheiterte mangels Panel/Broker-Tier-2; Time & Sales hat kein MCP-Werkzeug.
- Das CPI-Fenster 12.08.2026, 14:30 Europe/Berlin wurde visuell mit VWAP/CVD geprüft. Der erste Impuls und spätere Gegenfluss bestätigen: Delta ohne Follow-through ist kein Richtungssignal.

### Entscheidung

Der aktive Kern bleibt `VWAP + CVD`. OI ist optional/marktbezogen. Volume Profile ist erster Upgrade-Kandidat. Footprint, DOM und Tape bleiben `NEEDS MORE DATA` statt durch Community-Skripte simuliert zu werden.

### Nicht ausgeführt

- kein Layout gespeichert oder überschrieben
- keine echte Order, kein Trade, kein Alert
- keine Pine-Erstellung oder Veröffentlichung
- kein Community-Orderflow-/Whale-/Signalindikator
