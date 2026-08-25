# Orderflow Source Ledger

**Stand:** 2026-08-25
Die Qualitätsnote bewertet Lernwert und Nachprüfbarkeit, nicht behauptete Profitabilität. Wo kein unabhängiger Track Record vorliegt, steht ausdrücklich `nicht verifiziert`.

## Bewertungsmaßstab

- **A:** Primär-/Fachquelle, reproduzierbare Definitionen oder besonders belastbare berufliche/akademische Grundlage.
- **B:** brauchbare Lernquelle mit konkreten Beispielen, aber kommerzieller Eigeninteresse oder nicht unabhängig verifizierter Performance.
- **C:** einzelne Konzepte brauchbar; hoher Marketing-/Hindsight-Anteil oder schwache Reproduzierbarkeit.
- **D:** vermeiden; Behauptungen ohne prüfbare Methodik, Ergebnis-Hindsight oder garantierte Gewinne.

## Ledger

| Quelle | Plattform / URL | Thema / Content-Art | Live/Theorie/Mentorship | Note | Gelernt | Fragwürdig / Grenze | Verifizierung |
|---|---|---|---|---|---|---|---|
| CME Group Market by Order | [CME](https://www.cmegroup.com/articles/faqs/market-by-order-mbo.html) | MBO vs MBP, Queue, Full Depth | technische Primärquelle | A | Was ein echter zentraler Orderbook-Feed enthält | keine Trading-Edge-Aussage | Exchange-Dokumentation verifiziert |
| CME Rule 575 / Spoofing | [CME](https://www.cmegroup.com/education/courses/futures-trading-mechanics-and-regulation/disruptive-practices-prohibited-spoofing) | Pulling/Stacking-Risiko | Regulierung/Theorie | A | sichtbare DOM-Liquidität ist nicht garantiert beständig | keine Setup-Performance | Exchange-Regelwerk verifiziert |
| Cont, Kukanov, Stoikov | [SSRN/JFE](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1712822) | Order-flow imbalance und kurzfristiger Preisimpact | peer-reviewed Research | A | OFI informativer als rohes Volumen in untersuchtem Aktien-Datensatz | nicht direkt als Retail-Setup oder Futures-PnL übertragbar | Paper/Publikation verifiziert |
| Sierra Chart Numbers Bars | [Dokumentation](https://www.sierrachart.com/index.php?page=doc/NumbersBars.php) | Footprint, Bid×Ask, Delta, diagonal imbalance | technische Primärquelle | A | Footprint braucht Tick-/Bid-Ask-Daten; DOM ist getrennt | Produktanbieter, keine Profitabilität | Methodik verifiziert |
| Sierra Chart Cumulative Delta | [Dokumentation](https://www.sierrachart.com/index.php?page=doc/helpdetails71.html) | CVD und Datenanforderung | technische Primärquelle | A | historische Bid-/Ask-Volumes sind zwingend für echtes Volumen-CVD | serviceabhängig | Methodik verifiziert |
| TradingView Footprint/Delta/Profile | [Footprint](https://www.tradingview.com/support/solutions/43000726164-volume-footprint-charts-a-complete-guide/), [Delta](https://www.tradingview.com/support/solutions/43000725057-volume-delta/), [Profile](https://www.tradingview.com/support/solutions/43000502040-volume-profile-indicators-basic-concepts/) | Plattformberechnung und Limits | technische Primärquelle | A | Intrabar-Richtung ist Schätzung; Footprint kann repainten; VP-Volume-Typ variiert | nicht identisch mit Exchange-Bid/Ask | Methodik verifiziert |
| Jim Dalton | [Website](https://jimdaltontrading.com/about/), [Wiley-Buch](https://onlinelibrary.wiley.com/doi/book/10.1002/9781119196709) | Auction Market Theory/Market Profile | Theorie/Mentorship | A für AMT-Grundlage | kontinuierliche Auktion, Kontext, Value, Was-nicht-geschieht | Kursmarketing; Profitabilität nicht unabhängig belegt | CBOT/CBOE-Biografie und Publikation belegbar; PnL nicht verifiziert |
| Bookmap Education | [Kurs](https://bookmap.com/learning-center/market-mechanics/bookmap-education-course/trading-order-flow-dom-market-depth-trading), [Absorption](https://bookmap.com/learning-center/en/supply-demand-setups/supply-demand-setups/absorption-exhaustion) | DOM, Heatmap, Aggression, Absorption/Exhaustion | Theorie/Video | B | resting liquidity und executed volume gemeinsam lesen; Reaktion bestätigen | Plattformanbieter verkauft Tool; Beispiele sind keine Edge-Validierung | Inhalte öffentlich; Profitabilität nicht verifiziert |
| Axia Futures | [YouTube](https://www.youtube.com/@AxiaFutures), [Course Outline](https://axiafutures.com/lp/trading-decoded/) | Price Ladder, Footprint, Profile, Risk, Live-Beispiele | Live-Trade-Clips/Mentorship | B | strukturierter Skill-Aufbau und Debriefing; einige live erklärte Trades | kostenpflichtige Ausbildung; selektierte Clips; kein unabhängiger PnL-Nachweis | Organisation/Content verifizierbar; Profitabilität nicht verifiziert |
| Jigsaw Trading / Peter Davies | [Education](https://www.jigsawtrading.com/education-jigsaw-professional-trading-education/), [Free lessons](https://www.jigsawtrading.com/free-order-flow-analysis-lessons/) | DOM/Tape, Drills, CVD, Reversals, Breakouts | Theorie/Replay/Live-Footage | B | Leiter lesen als Verhalten/Pace statt Einzelzahl; deliberate practice | Software-/Kursverkauf; Performanceclaims nicht unabhängig geprüft | Content verifizierbar; Profitabilität nicht verifiziert |
| FuturesTrader71 | [Website](https://futurestrader71.com/) | Auction Theory, Volume Profile, Risk, Daily Prep | Theorie/live Market Prep/Mentorship | B | Szenarien, Erwartungsmanagement, Profile im Kontext | Eigenangaben zu Erfahrung; PnL nicht öffentlich unabhängig geprüft | langjährige öffentliche Inhalte, Profitabilität nicht verifiziert |
| John Grady / No BS Day Trading | [Kursübersicht](https://www.nobsdaytrading.com/courses/basic-course/), [Webinar](https://www.youtube.com/watch?v=PK2hr4Evz68) | DOM/Depth & Sales, Treasury-/ES-Scalping | reale Trade-Beispiele/Webinar/Mentorship | B | markt- und ladder-spezifische Tape-Praxis | kommerziell; Beispielauswahl; Track Record nicht unabhängig | Content vorhanden; Profitabilität nicht verifiziert |
| SMB Capital | [Tape syllabus](https://smbpowerpoints.s3.amazonaws.com/SMB-Foundation-Syllabus.pdf) | Tape Reading in US-Aktien | Ausbildung/Trade-Reviews | B–C | strukturierte Tape-Übungen und Review-Kultur | aktienspezifisch; Firma/Kurse kommerziell; individuelle PnLs nicht verifiziert | Organisationsmaterial verifizierbar; Profitabilität nicht verifiziert |
| Anonyme „nachher eingezeichnet“-Clips | beliebige Social-Media-Posts ohne Timestamp/Replay | isolierte Footprint-Signale | Hindsight/Marketing | D | nichts wird in aktive Regeln übernommen | keine Vorabentscheidung, Feed- oder Kostenangabe | nicht verifizierbar |

## Zulässige Ableitung

Aus einer Note-A-Quelle darf ein `CORE`-Prinzip entstehen, wenn es eine Daten-/Mikrostrukturgrundlage ist. Ein konkretes Entry-Setup bleibt trotzdem `CANDIDATE`, bis es mit unserem Feed getestet wurde. Creator-Behauptungen werden nie als Performancebeleg übernommen.
