# Orderflow Technical Capability Audit

**Auditzeit:** 2026-08-25, Europe/Berlin
**Umgebung:** Codex → TradingView Desktop MCP → CDP ausschließlich `127.0.0.1:9222`
**Änderungen am Layout/Chart:** Chart auf `CME_MINI_DL:NQ1!`, 5m, VWAP + CVD konfiguriert; neue Indikatorvorlage `MRWAGWAN_ORDERFLOW_CORE`; bestehendes Layout nicht gespeichert/überschrieben

## Praktischer MCP-Audit

| Fähigkeit | Ergebnis | Evidenz / Grenze |
|---|---|---|
| TradingView Desktop / MCP | PASS | CDP verbunden; ausschließlich `127.0.0.1:9222`; lokaler MCP auf aktuellem Commit |
| Chartstatus | PASS | Endzustand `CME_MINI_DL:NQ1!`, 5m, Candles; natives Session-VWAP + natives CVD |
| OHLCV | PASS | 100×5m pro Testfeed summarisiert; Bar-Volumes verfügbar |
| Futures-/Kryptofeeds | PASS WITH DELAY LIMIT | GC/NQ/ES/6E als `_DL`; Coinbase BTCUSD und Binance BTCUSDT.P exchange-spezifisch |
| VWAP | PASS | Session/hlc3, Bänder aus; auf allen sechs Feeds nichtleere Werte |
| CVD | CONDITIONAL PASS | natives TradingView-CVD, 1D-Reset und 1m-Intrabar; auf allen sechs Feeds Werte; weiterhin Intrabar-Schätzung |
| Bar Delta | PASS AS PROXY | natives Delta praktisch addiert und gelesen; danach zugunsten CVD entfernt; kein Roh-Bid/Ask-Tradefeed |
| Open Interest | PASS / MARKET-SPECIFIC | NQ Daily lieferte `298,2K`; traditionelle Futures in TradingView nur Daily, Krypto intraday |
| Volume Profile | BLOCKED BY PLAN | nativer Session-VP-/HD-Add-Test öffnete Basic→Premium-Upgrade; kein Community-Ersatz installiert |
| TPO / Market Profile | BLOCKED BY PLAN + MCP LIMIT | nativer Indikator öffnete Basic→Premium-Upgrade; TPO-Charttyp in aktueller MCP-Charttyp-API unbekannt |
| Native Volume Footprint | MCP LIMIT / NOT ACTIVE | MCP-Charttyp-API akzeptiert nur Typ 0–9 und verweigert `VolumeFootprint`; Community-Footprints abgelehnt |
| Echte Bid/Ask-Tradevolumen | NOT VERIFIED | kein MCP-Rohdatenwerkzeug für Trades am Bid/Ask; TradingView-CVD ist Proxy |
| DOM / Order Book | FAIL IN CURRENT STATE | `depth_get` meldet „DOM panel not found“; kein unterstützter Broker-/Tier-2-Zugriff praktisch aktiv |
| Time & Sales / Tape | UNAVAILABLE VIA MCP | kein MCP-Werkzeug für Trade-by-Trade-Tape |
| Historische Tick-/Depth-Daten | UNAVAILABLE VIA MCP | OHLCV/Studienwerte, aber kein Tick-/Depth-Export |
| Futures-Echtzeit | FAIL | `_DL` plus Quotezeitstempel etwa 10 Minuten hinter Chartzeit; separater CME-Echtzeitfeed fehlt |
| Indikatorvorlage | PASS | `MRWAGWAN_ORDERFLOW_CORE` neu erstellt; VWAP + CVD; Symbol/Intervall nicht gespeichert; keine Vorlage überschrieben |
| Regime-/Newsdarstellung | PASS WITH LIMITS | Trend/Range/High-/Low-Vol-Daten gelesen; NQ-CPI-Fenster 12.08.2026 visuell geprüft; verzögerter Feed, kein Live-News-Test |

## Entscheidende Plattformmethodik

TradingView beschreibt Volume Delta und Volume Footprint als Klassifikation von Intrabar-Volumen nach Richtung der Intrabar-Preisbewegung. Das ist eine Schätzung von Kauf-/Verkaufsdruck und nicht automatisch dasselbe wie exchange-seitig klassifizierte Trades am Ask/Bid. TradingView weist außerdem auf mögliches Repainting des Footprints durch unterschiedliche Echtzeit- und historische Intrabar-Quellen hin.

Volume Profile nutzt bei Forex, Indizes und Krypto-CFDs Tickvolumen und trennt Up/Down nach Bar-Richtung; bei Aktien Trade-Volume und bei Krypto je nach Feed Base-/Quote-Volume. Deshalb müssen Instrument und Berechnung in jedem Datensatz stehen.

## Account-/Abo-Grenze

Der eingeloggte TradingView-Upgrade-Dialog zeigte am 2026-08-25 ausdrücklich **„Aktuelles Abonnement: Basic“**. Volume Profile und TPO verlangten Premium. Die frühere Annahme „Essential“ ist für diesen Audit veraltet. VWAP, natives CVD und Open Interest waren praktisch nutzbar. Account-/Produktseiten können sich ändern; maßgeblich bleibt der praktische Test im eingeloggten Konto.

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
