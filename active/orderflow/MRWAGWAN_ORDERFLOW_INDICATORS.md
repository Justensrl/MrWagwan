# MrWagwan Orderflow Indicators

**Stand:** 2026-08-25

**Status:** praktisch mit TradingView Desktop über Codex/MCP geprüft

**Strategie:** `ORDERFLOW ONLY`

## 1. Evidenzkennzeichnung

- **SOURCE CONFIRMED:** Definition oder Datenanforderung ist durch eine technische Primärquelle belegt.
- **MULTIPLE SOURCE CONFIRMATION:** mindestens zwei voneinander getrennte Fach-/Primärquellen stützen dasselbe Grundprinzip.
- **INFERRED:** nachvollziehbare Ableitung für unser Setup, aber keine direkte Quellenbehauptung.
- **OWN RESEARCH:** eigener reproduzierbarer TradingView-/MCP-Test vom 2026-08-25.

## 2. Minimaler aktiver Kern

TradingView meldete im Upgrade-Dialog **Basic** als aktuelles Abonnement. Deshalb wurde kein Premium-Werkzeug umgangen und kein Community-Ersatz installiert.

| Bestandteil | Konfiguration | Zweck | Status |
|---|---|---|---|
| Session VWAP | nativer `Volume Weighted Average Price`; Anchor `Session`; Source `hlc3`; alle Standardabweichungsbänder aus | Session-Fair-Value-/Execution-Referenz, nicht Richtungssignal | `CORE AVAILABLE` — OWN RESEARCH |
| Cumulative Volume Delta | natives `Cumulative Volume Delta`; Reset/Anchor `1D`; Methode `Time`; Intrabar `1m` | geschätzten Aggressionsverlauf und fehlenden/erzielten Preisfortschritt vergleichen | `CORE PROXY` — SOURCE CONFIRMED + OWN RESEARCH |

**Gespeicherte TradingView-Indikatorvorlage:** `MRWAGWAN_ORDERFLOW_CORE`

- gespeichert: `VWAP`, `CVD`
- Symbol speichern: **aus**
- Intervall speichern: **aus**
- vorhandene Vorlagen vor Erstellung: **keine**
- bestehendes Layout `MrWagwan`: **nicht gespeichert und nicht überschrieben**

Der Kern ist absichtlich klein. VWAP und CVD dürfen keine Long-/Short-Entscheidung allein erzeugen. Preisfortschritt, Reaktion, Auction-Kontext, Feedqualität und Gegenevidenz bleiben zwingend.

## 3. Aktives Tool 1 — Session VWAP

### Name

`Volume Weighted Average Price` — nativer TradingView-Indikator, Anzeige `VWAP (Session)`.

### TradingView-Quelle / Author

TradingView Built-in `STD;VWAP`; kein Community-Author und kein undurchsichtiger Fremdcode.

### Zweck

Volumengewichtete Session-Referenz für Lage, Rotation, Akzeptanz und Rückkehr zum durchschnittlich gehandelten Preis.

### Datenquelle

OHLCV des gewählten Symbols; Preisquelle `hlc3`; Gewichtung durch das vom Feed gelieferte Volumen. Bei Futures ist dies Trade Volume, bei CFDs/Spot-FX kann die Volumenqualität abweichen.

### Warum verwenden wir ihn?

`INFERRED + OWN RESEARCH`: Er liefert mit einem einzigen Overlay eine klare Auction-/Execution-Referenz und berechnete auf allen sechs Testfeeds. In den geprüften Quellen lag keine belastbare einheitliche Mentorship-Einstellung vor; deshalb wird keine Creator-Empfehlung behauptet.

### Einstellungen

- Anchor: `Session`
- Source: `hlc3`
- Offset: `0`
- Standardabweichungsbänder 1–3: `aus`
- keine marktbezogene Überoptimierung

### Wie lese ich ihn?

- Preis rotiert wiederholt um VWAP: mögliche Balance/Acceptance.
- Preis entfernt sich mit Aktivität und hält Abstand: mögliche Initiative/Price Discovery.
- Rückkehr zum VWAP nach gescheitertem Fortschritt: mögliche Re-Akzeptanz; erst Reaktion/Flow prüfen.

### Was bedeutet kontextuell bullisch?

Akzeptanz oberhalb eines steigenden VWAP zusammen mit positivem Preisfortschritt und passender Flow-Bestätigung. Das ist Evidenz, kein automatischer Long-Trigger.

### Was bedeutet kontextuell bearisch?

Akzeptanz unterhalb eines fallenden VWAP zusammen mit negativem Preisfortschritt und passender Flow-Bestätigung. Das ist Evidenz, kein automatischer Short-Trigger.

### Was bedeutet NICHT automatisch Long/Short?

Ein bloßer Cross, ein kurzer Wick durch VWAP oder „Preis oberhalb = Long“/„unterhalb = Short“.

### Typische Fehler

- VWAP als Moving-Average-Signal handeln.
- Volume-Typ des Feeds nicht prüfen.
- einen neuen Session-Reset mit einem Strukturwechsel verwechseln.
- Standardabweichungsbänder ohne präregistrierte Regel als Targets benutzen.

### Märkte und Einschränkungen

Aktiv getestet auf GC, NQ, ES, 6E, Coinbase BTCUSD und Binance BTCUSDT.P. Auf `_DL`-Futures nicht für zeitkritische Live-Ausführung; auf exchange-spezifischem BTC nicht als Gesamtmarkt-VWAP ausgeben.

## 4. Aktives Tool 2 — Cumulative Volume Delta

### Name

`Cumulative Volume Delta` — nativer TradingView-Indikator, Anzeige `CVD (1D, Time, 1)`.

### TradingView-Quelle / Author

TradingView Built-in `STD;Cumulative Volume Delta`; kein Community-Skript.

### Zweck

Den geschätzten kumulativen Aggressionsverlauf mit dem tatsächlich erzielten Preisfortschritt vergleichen.

### Datenquelle

TradingView klassifiziert Volumen anhand der Richtung niedrigerer Intrabars. Im Kern: 1m-Intrabars, täglicher Reset. Das ist **INTRABAR-APPROXIMATION**, kein verifizierter Trade-by-Trade-Bid-/Ask-Feed.

### Warum verwenden wir ihn?

`SOURCE CONFIRMED + MULTIPLE SOURCE CONFIRMATION + OWN RESEARCH`: TradingView dokumentiert die Berechnung; Sierra dokumentiert den strengeren Datenbedarf für echtes CVD; Bookmap/Jigsaw nutzen Delta/CVD als Kontext oder Bestätigung, nicht als alleinige Richtung.

### Einstellungen

- Anchor/Reset: `1D`
- Methode: `Time`
- Custom Lower Timeframe: `aus`
- angezeigter Intrabar-Timeframe: `1m`

### Wie lese ich ihn?

- CVD und Preis machen gemeinsam Fortschritt: Aggression erzielt vorerst Ergebnis.
- CVD steigt/fällt stark, Preis kommt aber nicht voran: mögliche Absorption oder Gegenliquidität; Folgepreisreaktion erforderlich.
- Preis bewegt sich ohne entsprechende CVD-Bestätigung: mögliche Divergenz, dünne Liquidität oder Proxy-Artefakt; alternative Erklärung nennen.

### Was bedeutet kontextuell bullisch?

Steigendes CVD plus steigender Preis, Akzeptanz und Follow-through an einem orderflow-/auction-basierten Ort. Kein automatischer Long-Trigger.

### Was bedeutet kontextuell bearisch?

Fallendes CVD plus fallender Preis, Akzeptanz und Follow-through. Kein automatischer Short-Trigger.

### Was bedeutet NICHT automatisch Long/Short?

Positives CVD, negatives CVD, eine einzelne Divergenz oder eine große Delta-Kerze.

### Typische Fehler

- Proxy als echtes Bid/Ask-Delta bezeichnen.
- täglichen Reset als Käufer-/Verkäuferwechsel interpretieren.
- CVD zwischen Börsen/Feeds vergleichen, als seien Volumen und Teilnehmer identisch.
- Absorption ohne fehlenden Preisfortschritt und Gegenreaktion behaupten.

### Märkte und Einschränkungen

Auf allen sechs Testfeeds berechnet. Aussage bleibt feed-spezifisch; Futures verzögert, Coinbase/Binance jeweils nur ein Handelsplatz. Für Footprint-Excess, Stacked Imbalance oder echtes Tape genügt dieses CVD nicht.

## 5. Rangliste der geprüften Werkzeuge

| Rang | Werkzeug | Einstufung | Datenrealität | Praktisches Ergebnis |
|---:|---|---|---|---|
| 1 | Native Volume Footprint | `MUST HAVE` für fortgeschrittenes Footprint-Training | TradingView klassifiziert Intrabar-Volumen anhand Intrabar-Preisbewegung; nicht automatisch echtes Exchange-Bid/Ask | `BLOCKED`: aktuelles MCP unterstützt den Charttyp nicht; Basic-Konto; Community-Footprints abgelehnt |
| 2 | Session Volume Profile / HD | `MUST HAVE` für Auction-/Value-Kontext | bei Futures echtes Trade Volume, Up/Down-Verteilung jedoch bar-/intrabarbasiert; bei CFD/FX nur Tickvolumen | `BLOCKED BY PLAN`: nativer Add-Test öffnete Basic→Premium-Sperre |
| 3 | CVD | `CORE PROXY` | TradingView schätzt Buy/Sell-Pressure aus Intrabars; Sierra verlangt für echtes CVD historisches Bid-/Ask-Volumen | `PASS`: auf GC, NQ, ES, 6E, Coinbase BTCUSD und Binance BTCUSDT.P nichtleere Werte |
| 4 | Session VWAP | `CORE AVAILABLE` | volumen-/preisgewichtete Session-Referenz; kein Orderbuch und kein Entry-Signal | `PASS`: auf allen sechs Feeds nichtleere Werte; Bänder deaktiviert |
| 5 | Open Interest | `USEFUL / MARKET-SPECIFIC` | traditionelle Futures nur Daily; Kryptoderivate intraday verfügbar | `PASS`: NQ Daily lieferte `298,2K`; nicht im Kern wegen Zeitauflösung/Platzlimit |
| 6 | DOM / Market Depth | `MUST HAVE` nur für Depth-Hypothesen | resting liquidity; flüchtig, pulling/stacking/spoofing möglich; Broker-Tier-2 nötig | `FAIL CURRENT STATE`: DOM-Panel/geeigneter Brokerfeed nicht aktiv |
| 7 | Time & Sales | `MUST HAVE` nur für Tape-Training | einzelne Ausführungen, Pace und Größe; feedabhängig | `UNAVAILABLE VIA MCP`: kein Tape-Werkzeug |
| 8 | TPO / Market Profile | `OPTIONAL SPECIALIST` | Zeit-am-Preis; ergänzt Auction-Kontext, ist kein echtes Orderflow | `BLOCKED BY PLAN`: Basic→Premium-Sperre; zusätzlich nativer TPO-Charttyp nicht im MCP |
| 9 | Session-Markierungen | `OPTIONAL` | Zeitkontext, kein Flow | nicht installiert: kein freier Nutzen gegenüber knappen zwei Chartplätzen und klarer Zeitachse |
| 10 | opaque „Smart Orderflow / Whale / Institutional Signals“ | `REJECTED` | Methodik nicht prüfbar oder Community-Blackbox | nicht installiert |

### Entscheidungs- und Redundanzmatrix

| Tool | Zweck | Quelle | Datenqualität | Nutzen | Redundanz | Entscheidung |
|---|---|---|---|---|---|---|
| Native Footprint | Bid/Ask-/Imbalance-Darstellung je Preislevel | TradingView/Sierra; Axia/Bookmap/Jigsaw als Lehrcluster | TradingView-Proxy; echtes Bid/Ask nur mit geeignetem Feed | sehr hoch bei verifizierter Technik | teilweise Delta/CVD | ✅ MUST HAVE, aktuell BLOCKED |
| Session Volume Profile | POC, VAH/VAL, HVN/LVN, Value | TradingView; Dalton/FT71 | Futures-Trade-Volume, Up/Down geschätzt | sehr hoch für Auction-Kontext | TPO/Fixed/Visible Profile überschneiden sich | ✅ MUST HAVE, aktuell BLOCKED |
| CVD | kumulativer Aggressionsproxy | TradingView/Sierra/Bookmap/Jigsaw | Intrabar-Approximation im aktuellen Setup | hoch als Kontext | Bar Delta teilweise redundant | ✅ MUST HAVE als Proxy |
| Session VWAP | Session-Referenz/Fair Value | TradingView; methodisch abgeleitet | feedabhängiges OHLCV | mittel bis hoch, sehr schlank | Profile-POC nicht identisch | 🟡 USEFUL → aktiver Kern |
| Open Interest | offene Derivatekontrakte | TradingView | echte OI-Serie, Futures nur Daily | markt-/regimeabhängig | keine direkte Delta-Redundanz | 🟡 USEFUL optional |
| DOM | resting liquidity/Änderung | CME/TradingView/Bookmap/Jigsaw | Tier-2-/Brokerfeed nötig | hoch für Depth-Training | nicht durch Footprint ersetzbar | 🧪 TEST nach Feedzugang |
| Time & Sales | Pace, Size, einzelne Ausführungen | Sierra/Jigsaw/John Grady | Trade-by-Trade-Feed nötig | hoch für Tape-Training | ergänzt DOM/Footprint | 🧪 TEST, MCP nicht verfügbar |
| TPO | Zeit-am-Preis, Initial Balance, Single Prints | TradingView/Dalton | Preis-/Zeitprofil, kein echter Aggressor-Flow | mittel | hohe Redundanz zu Volume Profile | 🟡 OPTIONAL, aktuell BLOCKED |
| Session-Indikator | Sessionzeiten/-levels | TradingView-Zeitachse | Zeitdaten | niedrig im Kern | mit Zeitachse/Profile redundant | ❌ nicht installiert |
| Marketing-/Whale-Tools | automatische Signale | keine belastbare A/B-Basis | unklar | nicht nachweisbar | überladen | ❌ REJECT |

## 6. Was „echt“ und was nur Schätzung ist

### SOURCE CONFIRMED

- Ein echter Footprint/Numbers-Bar benötigt Tickdaten und Bid-/Ask-Volumen.
- TradingView Volume Delta und CVD leiten Druck aus Intrabar-Preisbewegungen ab; das ist ein Proxy.
- TradingView Volume Profile verteilt Volumen aus niedrigeren Timeframes und verwendet für Forex/Index/Krypto-CFD Tickvolumen.
- DOM zeigt ruhende Limit-Liquidität; ausgeführtes Volumen ist davon getrennt.
- Open Interest misst offene Derivatekontrakte und ist bei traditionellen Futures in TradingView nur auf Tagesbars verfügbar.

### MULTIPLE SOURCE CONFIRMATION

- Ausgeführtes Volumen, DOM und Preisreaktion müssen getrennt und gemeinsam gelesen werden.
- CVD ist Bestätigung/Kontext und kein alleinstehendes Signal.
- Absorption bedeutet aggressive Ausführung ohne entsprechenden Preisfortschritt plus nachfolgende Reaktion; großes Volumen allein genügt nicht.

### INFERRED

- Auf dem aktuellen Basic-Konto ist `VWAP + CVD` das kleinste sinnvolle, reproduzierbare Lehrsetup.
- Volume Profile würde beim ersten Upgrade den Kern stärker ergänzen als TPO, weil es Value/POC/HVN/LVN direkt volumenbasiert abbildet.
- Open Interest gehört in eine separate Daily-/Crypto-Derivatives-Prüfung und nicht dauerhaft in den 5m-Kern.

## 7. Feed-Matrix und Berechnungstest

| Markt | tatsächlich geladener Feed | Qualität | VWAP | CVD | Bewertung |
|---|---|---|---|---|---|
| GC | `COMEX_DL:GC1!` | zentraler Futures-Feed, ca. 10 Minuten verzögert | PASS | PASS | Datenstufe B; kein Live-Execution-Feed |
| NQ | `CME_MINI_DL:NQ1!` | zentraler Futures-Feed, ca. 10 Minuten verzögert | PASS | PASS | kanonischer Lehrfeed, aber nicht live |
| ES | `CME_MINI_DL:ES1!` | zentraler Futures-Feed, ca. 10 Minuten verzögert | PASS | PASS | Datenstufe B |
| 6E | `CME_DL:6E1!` | zentraler FX-Futures-Feed, ca. 10 Minuten verzögert | PASS | PASS | besserer Orderflow-Proxy als Spot-EURUSD |
| BTCUSD | `COINBASE:BTCUSD` | exchange-spezifischer Spotfeed | PASS | PASS | nur Coinbase, nicht „der gesamte Bitcoinmarkt“ |
| BTC Perpetual | `BINANCE:BTCUSDT.P` | exchange-spezifisches Derivat | PASS | PASS | geeignet für intraday OI-Kontext; Binance-spezifisch |

Die Futures-Quotes endeten im Test um 15:45/15:50 UTC, während der TradingView-Chart etwa 16:00 UTC zeigte. Die `_DL`-Kennung und Zeitstempel bestätigen die Verzögerung. Krypto aktualisierte bis zum laufenden 16:00-UTC-Bar.

## 8. Regime- und News-Funktionstest

Dieser Test prüft Darstellung und Datenverhalten, **keine Profitabilität**.

| Regime | Stichprobe | Ergebnis | Interpretation |
|---|---|---|---|
| Trend / Directional | Coinbase BTCUSD, 100×5m: `-1,21%`, Range `2.386,84` | PASS | VWAP/CVD blieben berechenbar; Delta nicht automatisch als Short-Signal verwenden |
| Range / Rotation | ES, 100×5m: `-0,04%`, Range `50,75` | PASS | CVD kann schwanken, ohne dass Preis netto fortschreitet; Rotation/Acceptance beachten |
| Hohe Volatilität | NQ, 100×5m: Range `287,75`, plus CPI-Fenster | PASS | große CVD-Impulse und Preisdisplacement sichtbar; Follow-through nötig |
| Niedrige Volatilität | 6E, 100×5m: Range `0,0019`, `+0,12%` | PASS | kleine Deltaänderungen nicht überinterpretieren; Kosten/Spread relativ wichtiger |
| Pre-/Post-News | NQ am 12.08.2026, CPI 08:30 ET / 14:30 Berlin | PASS WITH LIMITS | ruhiger Vorlauf, starker 14:30-Impuls, spätere Gegenbewegung; initiales Delta ist keine dauerhafte Richtung |

**News-Grenze:** Der CME-Feed war verzögert. Das Fenster ist für historische Schulung geeignet, nicht für eine zeitkritische Live-News-Entscheidung.

### Lesbarkeit und Widersprüche

- Lesbarkeit: PASS — nur ein Overlay und ein Unterpanel; keine Pfeile, Buy-/Sell-Labels oder Community-Signale.
- Datenkonsistenz: PASS für berechnete VWAP-/CVD-Werte auf sechs Feeds.
- Widersprüchliche Signale: erwartbar und kein Fehler. Preis relativ zu VWAP und CVD-Richtung können divergieren; dann zählt Follow-through beziehungsweise No Trade.
- Footprint-Lesbarkeit: NOT TESTABLE — nativer Charttyp nicht im MCP/Account aktiv.
- Fehlende Kerninformation: Profile-/Footprint-/DOM-/Tape-Daten bleiben die größten Grenzen.
- Alte ICT-/SMC-Indikatoren: im geprüften Chart nicht aktiv; Endzustand enthält ausschließlich VWAP und CVD.

## 9. Lehrreihenfolge

1. Feed, Exchange, Delay und Volume-Typ benennen.
2. Session-VWAP als Referenz lesen: darüber/darunter ist nur Lage, kein Signal.
3. CVD mit Preisfortschritt vergleichen: Bestätigung, Divergenz, fehlender Follow-through.
4. Daily Open Interest marktbezogen ergänzen; nicht in einen Intraday-Wert umdeuten.
5. Nach Upgrade: Session Volume Profile vor TPO lernen.
6. Footprint erst einsetzen, wenn nativer Charttyp und Datenmethodik praktisch verifiziert sind.
7. DOM und Tape erst mit Broker-/Tier-2-/Tape-Zugriff trainieren.

## 10. Sicherheits- und Nutzungsgrenze

- Keine echten Trades, Orders oder Alerts.
- Keine Pine-Veröffentlichung.
- Keine Community-Blackbox als Ersatz für fehlende native Daten.
- Kein vorhandenes Layout oder Template überschreiben.
- Aus `VWAP`, `CVD`, `OI`, Profile oder DOM entsteht nie allein eine Kauf-/Verkaufsempfehlung.

## 11. Primärnachweise

- TradingView: [Volume Footprint](https://www.tradingview.com/support/solutions/43000726164-volume-footprint-charts-a-complete-guide/)
- TradingView: [Volume Delta](https://www.tradingview.com/support/solutions/43000725057-volume-delta/)
- TradingView: [Volume Profile Grundlagen](https://www.tradingview.com/support/solutions/43000502040-volume-profile-indicators-basic-concepts/)
- TradingView: [Session Volume Profile HD](https://www.tradingview.com/support/solutions/43000557450-session-volume-profile-hd/)
- TradingView: [Open Interest](https://www.tradingview.com/support/solutions/43000685269-open-interest/)
- TradingView: [VWAP Auto-Anchored](https://www.tradingview.com/support/solutions/43000652199-vwap-auto-anchored/)
- TradingView: [TPO](https://www.tradingview.com/support/solutions/43000713306-time-price-opportunity-tpo-indicator/)
- TradingView: [DOM](https://www.tradingview.com/support/solutions/43000516459-depth-of-market-dom-what-it-is-and-how-traders-can-use-it/)
- CME: [Market by Order](https://www.cmegroup.com/articles/faqs/market-by-order-mbo.html)
- Sierra Chart: [Numbers Bars](https://www.sierrachart.com/index.php?page=doc/NumbersBars.php)
- Sierra Chart: [Cumulative Delta Datenanforderungen](https://www.sierrachart.com/index.php?page=doc/helpdetails71.html)
- BLS: [Release Calendar August 2026](https://www.bls.gov/schedule/2026/08_sched.htm)
