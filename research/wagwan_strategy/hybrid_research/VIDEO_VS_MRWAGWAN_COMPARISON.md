# Video vs. MrWagwan: regelbasierter Vergleich

Stand: 2026-08-22  
Video: `AZlbhU1xG9A`, *Making $1.1 MILLION Live Trading (STEAL THIS LIQUIDITY STRATEGY)*  
Vergleichsbasis: `WAGWAN_STRATEGY_V3_SESSIONS.md`, `SESSION_STANDARD.md`, `research_config.json` und die bestehenden Markt-/Walk-forward-Berichte.

## Bewertungsmaßstab

Eine Videoaussage wird nicht deshalb zur Strategie-Regel, weil der gezeigte Trade gewonnen hat. Eine Regel ist nur übernehmbar, wenn sie (a) vor Entry messbar, (b) ohne Zukunftsdaten reproduzierbar und (c) mit einem Invalidationskriterium versehen ist. Die vollständige Evidenzklassifikation mit Zeitstempeln steht in `VIDEO_STRATEGY_EXTRACTION.md`.

## Punkt-für-Punkt-Matrix

| Komponente | MrWagwan | Video-Strategie | Gemeinsamkeit | Unterschied | potenzieller Nutzen |
|---|---|---|---|---|---|
| HTF Bias | EMA-/Strukturkontext, bisher vor allem 1H/H4 | 4H-Demand und 1H-Pullback diskretionär geprüft | Top-down-Kontext | Video ohne formale Bias-Gleichung | Demand-Kontext als prüfbarer POI-Filter |
| Marktstruktur | bestätigte Pivots, Trend-/Range-Kontext | äußere kleine Swing-Struktur bearish, intern bullish | interne vs externe Struktur | Video nennt keine Pivotbreite | getrennte Strukturklassen verhindern Begriffsvermischung |
| BOS | Close-/Strukturbruch in V3 | interner bullish BOS erwartet | Bruch validiert Bewegung | Video-BOS teils erst nach Entry | nur Vor-Entry-Close darf triggern |
| CHoCH | Richtungswechsel gegen vorherige Struktur | nicht sauber als CHoCH formalisiert | Konzeptuell Market Shift | Terminologie/Trigger unklar | als deskriptives Countertrend-Feld, nicht erfundene Pflichtregel |
| MSS | Sweep + Displacement + Pivotbruch | bullische interne Bestätigung nach Sweep | zentraler Übergang | Timing im Video teils post-entry | feste 5m-Reihenfolge |
| Sweep | 0,08 ATR Session-Sweep in V3 | mehrere lokale Tiefs werden gesweept | Liquiditätsaufnahme vor Reversal | Video ohne Mindesttiefe | externe und interne Sweeps getrennt testen |
| BSL/SSL | Previous-session High/Low | mehrere Tiefs als SSL; Gegenziel Supply | echte Liquiditätsziele | BSL nicht gleich detailliert erklärt | mechanische Level statt nachträglicher Linien |
| Externe/interne Liquidität | Session-Level plus Struktur | lokale interne Lows, HTF/15m Supply | beide Ebenen relevant | Video ohne exakte Klassifikation | Ablation external-only vs internal+external |
| Displacement | Body >=0,50 ATR | V-Reaktion, bullische Expansion/Imbalance | impulsive Bestätigung | Video ohne Schwelle | messbarer Qualitätsfilter |
| FVG | Drei-Candle-FVG Pflicht | „imbalance“, Grenzen nicht definiert | Ineffizienz nach Sweep | formale Geometrie stammt von MrWagwan | isolierte FVG-Ablation |
| Order Block | in bisherigen SMC-Berichten vorhanden, nicht immer mechanisch | Begriff nicht zuverlässig definiert | POI-Idee | Video zeigt eher Demand/Flip als OB-Regel | Origin-Candle nur als algorithmischer Proxy |
| Premium/Discount | SMC-Kontext, bislang nicht harter V3-Filter | nicht formal quantifiziert | günstiger Entry-Bereich implizit | Video ohne Range-/50%-Regel | als A+-Deskriptor, nicht heimlicher Filter |
| Session | feste Berlin-Asia/London/NY-Fenster | London-Trade; vor NY bevorzugt | Intraday-Session wichtig | Video nutzt Deadline diskretionär | bindender Same-session-Exit |
| Entry | V3 Next-bar nach MSS/FVG | Reaktion/Bestätigung in Demand-/Flip-Region | Bestätigung nach Sweep | genaue Orderart unklar | 1m-FVG-Retest gegen Market-Entry testen |
| Stop | Sweep-Extrem +0,15 ATR, nie erweitern | erst knapp unter Low, dann unter Demand erweitert | technische Invalidierung | Video erhöht Risiko nach Entry | Außenkante vor Entry bestimmen, Ausweitung verwerfen |
| Invalidierung | Struktur-/Zonenbruch | unter Demand sei Idee invalidiert | jenseits POI | Video ändert Level nach Entry | vorab festgelegtes geschütztes Extrem |
| TP1 | 1R, 40% | kein systematisches TP1 | keine klare Gemeinsamkeit | Video hat primär ein Gesamtziel | MrWagwan beibehalten |
| TP2 | 2R, 40% | kein systematisches TP2 | keine klare Gemeinsamkeit | Video hat primär ein Gesamtziel | MrWagwan beibehalten |
| TP3 | 3R, 20%, Full TP | nächste 15m-Supply als Gesamtziel | finales Gegenliquiditätsziel | Video nicht starres 3R | 3R bleibt Full TP, Gegenliquidität prüft Raum |
| RR | feste R-Struktur | erwähnt planmäßiges 1:3 sinngemäß | Gewinner nicht früh abschneiden | keine vollständige Formel | robuste R-Auswertung |
| Management | TP1->BE, Same-session Exit | Set-and-forget; Ausnahmen bei Gegen-BOS/Deadline | geringe Mikroverwaltung | Stop-Verhalten widersprüchlich | nur vorab definierte Verwaltung |
| Newsfilter | bisher ganzer Hochrisiko-Tag | kein definierter Filter | keine | Video liefert keine Newsregel | offizielles Ereignisfenster separat ablatieren |
| Timeframes | künftig 1H/15m/5m/1m mit festen Rollen | 4H/1H Kontext, 15m Supply, 5m/1m Beobachtung | MTF | Rollen im Video nicht vollständig mechanisch | feste Kausalkette ohne Gleichgewichtung |

| Videoelement | Bestehendes MrWagwan-Element | Entscheidung | Begründung / Umsetzung |
|---|---|---|---|
| Top-down: 4H/1H Kontext, 15m Ziel/Setup | MTF-Kontext ist vorhanden, aber die aktuelle V3-Regel ist überwiegend 1H-basiert | **KEEP + präzisieren** | Feste Rollen werden auf 1H/15m/5m/1m begrenzt. 4H bleibt nur erläuternder Research-Kontext und ist kein zusätzlicher Signalparameter, damit die Nutzer-Vorgabe der festen Testframes erfüllt bleibt. |
| Reaktion an extremer Demand + „flip zone“ | POI/Demand bisher nicht als deterministischer Flip-Zonen-Typ formuliert | **TEST FIRST** | Zone wird ausschließlich aus einer bestätigten Impuls-Origin-Candle und dem Bruch eines bereits bekannten Pivots konstruiert. Keine nachträglich gezeichnete Zone. |
| Mehrere Tiefs werden gesweept, anschließend Reclaim | V3: vorheriges Session-Level, Sweep/Reclaim >= 0,08 ATR | **KEEP** | Externe Session-Liquidität bleibt Kernanker; bestätigte interne Pivot-Liquidität wird als zweite, getrennt auszuweisende Klasse ergänzt. |
| V-förmige Reaktion | Keine eigene Regel | **OPTIONAL FILTER / TEST FIRST** | Objektiviert als Reclaim innerhalb höchstens zwei 5m-Kerzen. Allein kein Entry. |
| Displacement + Imbalance/FVG | V3 verlangt MSS, Body >= 0,5 ATR und FVG | **KEEP** | Wird auf 5m bestätigt; Schwelle und FVG-Definition werden preregistriert. |
| Interner bullish BOS/Market Shift | V3 MSS/BOS vorhanden | **KEEP** | Nur ein Close jenseits eines vor dem Sweep bestätigten Pivots zählt. Wick allein zählt nicht. |
| Entry nach Reaktion/Bestätigung | V3: nächste Kerze; Video nicht exakt | **REPLACE CANDIDATE** | Hybrid testet 1m-Retest des 5m-FVG-Mittelpunkts statt pauschalem Next-bar-Entry. Eine Market-Fallback-Variante wird nur in der Ablation untersucht. |
| Ziel an nächster 15m Supply statt weiter 1H Supply | V3 starre 1R/2R/3R-Teile | **ADD, aber gedeckelt** | TP1/TP2/TP3 bleiben 1R/2R/3R; ein strukturelles Liquiditätsziel muss mindestens TP1 ermöglichen. TP3 ist immer „Full TP“. Liegt die erste harte Gegenliquidität vor TP1, gibt es kein Signal. |
| Stop wenige Pips unter Low, später unter Demand erweitert | V3: Sweep-Extrem + 0,15 ATR, niemals nachträglich erweitern | **REJECT (Erweiterung), KEEP (technische Invalidierung)** | Stop wird vor Entry außerhalb Sweep-/POI-Invalidierung festgelegt und danach niemals weiter weg bewegt. |
| Manuelles Schließen kurz vor TP wegen Slippage | V3: feste Targets + Session-Zwangsausgang | **TEST FIRST** | Objektiv nur als Zeit-/Session-Exit oder als bestätigter Gegen-MSS nach TP2 testbar. Kein diskretionäres „sieht nah genug aus“. |
| Nicht über Nacht / nicht ins Wochenende halten | V3: kein Cross-Session/Overnight | **KEEP** | Position endet spätestens am Ende der Entry-Session. |
| Keine ständige Kerzen-Mikroverwaltung | Bestehende Regeln implizieren feste Verwaltung | **KEEP** | Stop/Targets werden nach Entry deterministisch verwaltet; nur TP1->BE und vorab definierter Zeit-Exit. |
| Countertrend-Long trotz kleinem bearish Swing-Kontext | Bestehende H1-Bias-Filter | **TEST FIRST** | Separater Arm: nur an bestätigter 1H-Demand, nach externer SSL-Aufnahme und vollständiger 5m-Bestätigung. Nie mit Trendarm vermischen. |
| Keine formale Newsregel im Video | Bestehend: ganzer Hochrisiko-Tag blockiert | **REPLACE CANDIDATE** | Ablation vergleicht keinen Filter, +/-30/60/120 Minuten und kompletten Event-Tag. Nur verifizierte FOMC/CPI/PPI/NFP/ECB-Termine. |
| „Full pot“, Recovery-/Payout-Druck, sehr hoher Dollar-Risk | Modellrisiko 1% | **REJECT** | Research verwendet exakt 1R je Trade und beispielhaft 1% Modellrisiko. Dollar-PnL des Videos ist keine Evidenz. |
| Glaube/Überzeugung als Richtungssignal | Keine regelkonforme Entsprechung | **REJECT** | Nicht messbar, nicht falsifizierbar. |

## Konflikte und notwendige Klarstellungen

1. **Stop-Disziplin:** Im Video wird der Stop nach Entry vergrößert, später aber empfohlen, SL/TP nicht zu bewegen. Für die Hybridstrategie gilt die strengere, vorab prüfbare Regel: niemals Risiko nach Entry erhöhen.
2. **Bestätigung vs. Nach-Erzählung:** Ein Teil des bullish BOS wird erst nach Entry sichtbar. Er darf nicht rückwirkend als Entrybestätigung gelten. Im Test muss der 5m-MSS vor dem 1m-Entry abgeschlossen sein.
3. **Supply-/Demand-Zonen:** Sichtbare Rechtecke allein sind nicht reproduzierbar. Jede Zone benötigt eine algorithmische Entstehungszeit und darf erst ab diesem Zeitpunkt verwendet werden.
4. **Ergebnisbehauptung:** Der Video-PnL und die Kontogröße sind nicht unabhängig verifiziert und fließen weder in Erwartungswert noch in Positionsgröße ein.
5. **4H-Frage:** Das Video erwähnt 4H-Kontext. Der Pflicht-Backtest nutzt jedoch die festgelegten Frames 1H/15m/5m/1m. Ein aus 1H-Bars aggregierter 4H-Filter wird ausschließlich als Ablation geführt, nicht als heimlich zusätzlicher Basisparameter.

## Vorab-Hypothesen für die Ablation

Diese Hypothesen sind vor Sichtung der neuen Testergebnisse notiert:

- H1: Ein echter Bid/Ask-Kostenansatz verschlechtert BTCUSD stärker als EURUSD.
- H2: 5m-FVG-Pflicht reduziert die Anzahl, erhöht aber nicht zwingend den Erwartungswert.
- H3: Der 1m-Retest verbessert den Entry-Preis, verursacht jedoch verpasste Gewinner.
- H4: Ein +/-60-Minuten-Eventfilter ist weniger destruktiv für die Stichprobe als der bisherige komplette Event-Tag.
- H5: Der Countertrend-/Demand-Arm ist instabiler als der H1-Trendarm.
- H6: Die „nächste 15m Gegenliquidität“-Prüfung reduziert Trades mit unrealistischem Platz bis TP1.

## Entscheidungssperre

Keine Kategorie **TEST FIRST**, **OPTIONAL FILTER** oder **REPLACE CANDIDATE** wird aufgrund des Videos allein produktiv. Auswahl erfolgt nur auf IS + zeitlich folgenden Walk-forward-Fenstern. Die finale OOS-Periode wird genau einmal mit der eingefrorenen Variante ausgewertet.
