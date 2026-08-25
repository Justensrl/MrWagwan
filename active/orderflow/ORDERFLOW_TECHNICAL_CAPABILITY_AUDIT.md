# Orderflow Technical Capability Audit

**Auditzeit:** 2026-08-25, Europe/Berlin
**Umgebung:** Codex → TradingView Desktop MCP → CDP ausschließlich `127.0.0.1:9222`
**Änderungen am Layout/Chart:** keine

## Praktischer MCP-Audit

| Fähigkeit | Ergebnis | Evidenz / Grenze |
|---|---|---|
| TradingView Desktop / MCP | PASS | Desktop gestartet, CDP verbunden, lokale API erreichbar |
| Chartstatus | PASS | `TVC:USOIL`, 4H, Candles; Studies: Sessions [LuxAlgo], Community-CVD |
| OHLCV | PASS | 20 Bars summarisiert gelesen; normale Bar-Volumes verfügbar |
| Symbol-/Feed-Metadaten | PASS | aktueller Feed als `TVC`-CFD/Commodity erkannt |
| Futures-Symbole auffindbar | PASS | `CME:NQ` und `COMEX:GC` gefunden; Echtzeitberechtigung dadurch nicht bewiesen |
| Volume Profile | CONDITIONAL PASS | TradingView-Funktion offiziell vorhanden; MCP-Suche fand `Fixed Range Volume Profile`. Kein Price-Level-Datensatz im Audit extrahiert |
| Session Profile / TPO | CONDITIONAL PASS | Plattformfunktion vorhanden; nicht als maschinenlesbarer Profil-Datensatz praktisch verifiziert |
| CVD | CONDITIONAL PASS | vorhandenes Community-CVD liefert auslesbare Werte; Methodik nutzt Intrabars und ist kein Beweis für echten börsenseitigen Bid/Ask-Feed |
| Bar Delta | CONDITIONAL | TradingView kann Delta aus Intrabar-Preisbewegung schätzen. MCP besitzt keinen separaten Roh-Bid/Ask-Tradefeed |
| Native Volume Footprint | PLATFORM-ONLY / MCP LIMIT | TradingView dokumentiert den Charttyp. Aktuelle MCP-Charttyp-API bietet ihn nicht an; Community-Suche ersetzt den nativen Charttyp nicht. Footprint-Zellen wurden nicht maschinenlesbar verifiziert |
| Echte Bid/Ask-Tradevolumen | NOT VERIFIED | kein MCP-Rohdatenwerkzeug für Trades am Bid/Ask; aktueller CFD ungeeignet als zentraler Referenzfeed |
| DOM / Order Book | FAIL IN CURRENT STATE | MCP-Werkzeug vorhanden, meldet „DOM panel not found“. TradingView benötigt unterstützten Broker und Tier-2-Daten; keine Werte verfügbar |
| Time & Sales / Tape | UNAVAILABLE VIA MCP | kein MCP-Werkzeug für Trade-by-Trade-Tape; nicht verifizierbar |
| Historische Tickdaten | UNAVAILABLE VIA MCP | OHLCV-Abruf, aber kein Tick-Export. Aktuelle TradingView-Preistabelle reserviert historische Tickdaten für höhere Pläne; Kontoberechtigung nicht per MCP prüfbar |
| Echte Futures-Echtzeitfeeds | NOT VERIFIED | Symbole sind auffindbar. TradingView weist darauf hin, dass Exchange-Echtzeitdaten separat abonniert/verifiziert werden müssen |
| High-Impact-News | AVAILABLE SEPARATELY | Web-/Kalenderprüfung möglich; kein Ersatz für Mikrostrukturdaten |

## Entscheidende Plattformmethodik

TradingView beschreibt Volume Delta und Volume Footprint als Klassifikation von Intrabar-Volumen nach Richtung der Intrabar-Preisbewegung. Das ist eine Schätzung von Kauf-/Verkaufsdruck und nicht automatisch dasselbe wie exchange-seitig klassifizierte Trades am Ask/Bid. TradingView weist außerdem auf mögliches Repainting des Footprints durch unterschiedliche Echtzeit- und historische Intrabar-Quellen hin.

Volume Profile nutzt bei Forex, Indizes und Krypto-CFDs Tickvolumen und trennt Up/Down nach Bar-Richtung; bei Aktien Trade-Volume und bei Krypto je nach Feed Base-/Quote-Volume. Deshalb müssen Instrument und Berechnung in jedem Datensatz stehen.

## Account-/Abo-Grenze

Aus früherem Nutzerkontext ist „Essential“ genannt, aber das MCP liefert keinen verlässlichen Account-Entitlement-Endpunkt. Aktuelle offizielle Pricing-Seiten und ältere Produktankündigungen sind bei Footprint-Verfügbarkeit nicht vollständig konsistent. Daher wird die tatsächliche Kontofreischaltung nicht behauptet. Praktischer Funktionsnachweis im eingeloggten Konto ist vor Verwendung erforderlich.

## Erforderliche Mindestumgebung für belastbare Tests

1. Zentraler Futures-Kontrakt, nicht CFD/Spot-Proxy.
2. Dokumentierter Echtzeit- oder historischer Exchange-Feed.
3. Trade-by-Trade-Historie mit Bid/Ask-Klassifikation für Footprint/Delta.
4. Historische Depth-Daten für DOM/Pulling/Stacking-Hypothesen.
5. Reproduzierbarer Export mit Zeitstempel, Kontrakt, Tick Size, Session und Rollmethode.
6. Getrenntes Kostenmodell.

Bis diese Punkte praktisch erfüllt sind, bleiben Footprint-/DOM-Setups `NEEDS MORE DATA`; es werden keine Performancewerte erfunden.

## Offizielle Nachweise

- TradingView: [Volume Footprint Guide](https://www.tradingview.com/support/solutions/43000726164-volume-footprint-charts-a-complete-guide/)
- TradingView: [Volume Delta](https://www.tradingview.com/support/solutions/43000725057-volume-delta/)
- TradingView: [Volume Profile — Grundlagen](https://www.tradingview.com/support/solutions/43000502040-volume-profile-indicators-basic-concepts/)
- TradingView: [DOM](https://www.tradingview.com/support/solutions/43000516459-depth-of-market-dom-what-it-is-and-how-traders-can-use-it/)
- TradingView: [Marktdaten-Abos](https://www.tradingview.com/support/solutions/43000471705-how-to-purchase-additional-market-data/)
- CME: [Market by Order](https://www.cmegroup.com/articles/faqs/market-by-order-mbo.html)
- Sierra Chart: [Numbers Bars / Footprint](https://www.sierrachart.com/index.php?page=doc/NumbersBars.php)
- Sierra Chart: [Cumulative Delta Datenanforderungen](https://www.sierrachart.com/index.php?page=doc/helpdetails71.html)
