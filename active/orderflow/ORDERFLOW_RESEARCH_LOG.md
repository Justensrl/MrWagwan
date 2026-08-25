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
