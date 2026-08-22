# MrWagwan Hybrid Research Strategy — preregistrierte Spezifikation

Version: `HYBRID-PREREG-1.0`  
Preregistriert: 2026-08-22, **vor** Berechnung der neuen Backtest-Ergebnisse  
Status: ausschließlich Research/Backtest; nicht für Live-Trading freigegeben

## 1. Forschungsziel und Grenzen

Die Strategie verbindet die bereits dokumentierte MrWagwan-Logik (Session-Liquidität, Sweep, MSS, Displacement, FVG, feste R-Ziele) mit den objektivierbaren Elementen des Videos `AZlbhU1xG9A` (Mitigation/Flip-POI, interner Shift, nächstes 15m-Gegenziel, 1m-Retest). Sie erzeugt keine Order, keinen Alert und keine Veröffentlichung.

Der Testzeitraum ist **2024-08-01 00:00 UTC bis 2025-08-01 00:00 UTC (exklusiv)**. Die Datenquelle ist Dukascopy Bank; NASDAQ und SP500 sind die CFD-Proxys `USATECHIDXUSD` und `USA500IDXUSD`, nicht CME NQ/ES-Futures. Diese Instrumentenabweichung muss in jedem Ergebnisbericht sichtbar bleiben.

## 2. Daten, Zeitzone und ausführbare Preise

- Rohdaten: 1-Minuten Bid und Ask; Lücken werden nicht synthetisch gefüllt.
- Analysepreis: OHLC-Mittel aus Bid/Ask je Minute.
- Long-Entry zum Ask, Long-Exit zum Bid; Short-Entry zum Bid, Short-Exit zum Ask.
- Zusätzlich zur beobachteten Spreadwirkung wird pro Fill adverse Slippage angesetzt: XAUUSD 0,5 bp, BTCUSD 5 bp, NASDAQ 0,5 bp, SP500 0,5 bp, EURUSD 0,1 bp vom Fill-Preis. Modellkommission je Seite: XAUUSD 0,2 bp, BTCUSD 2 bp, NASDAQ/SP500 0,2 bp und EURUSD 0,05 bp, anteilig je Partial. Dies ist ein konservatives Forschungsmodell, kein Brokerangebot.
- Bar-Ambiguität: Wenn SL und TP in derselben 1m-Kerze liegen, wird SL zuerst gebucht.
- Alle Aggregationen werden ausschließlich aus bereits abgeschlossenen 1m-Bars aufgebaut. Keine Vorwärtsfüllung über Datenlücken.

Verbindliche Sessions in `Europe/Berlin` einschließlich echter DST-Konvertierung:

- Asia 02:00–09:00
- London 09:00–15:30
- New York 15:30–22:00
- Keine Entries außerhalb dieser Fenster; keine Position über das Ende der Entry-Session.

## 3. Feste Timeframe-Rollen

| Frame | Rolle | Darf Entry allein auslösen? |
|---|---|---|
| 1H | Bias, Regime, ATR, bestätigte Supply/Demand-Origin | Nein |
| 15m | externe/interne Liquidität, Sweep/Reclaim, POI-Mitigation, Zielraum | Nein |
| 5m | MSS/BOS, Displacement und FVG-Bestätigung | Nein |
| 1m | Retest und ausführbarer Entry; Tradeverwaltung | Ja, aber nur nach vollständiger höherer Kette |

Kein Frame darf durch spätere Kerzen neu etikettiert werden. Ein Fraktal mit zwei Bars rechts ist erst nach Abschluss der zweiten rechten Bar bekannt.

## 4. Vorab definierte Strukturen

### 4.1 ATR und Pivots

- ATR: Wilder ATR(14) je Frame, nur abgeschlossene Bars.
- Bestätigtes Pivot High/Low: Fraktal `2 links / 2 rechts`; nutzbar ab Close der zweiten rechten Bar.
- Interne Liquidität: jüngstes bestätigtes 15m-Pivot derselben Session oder der unmittelbar vorherigen Session.
- Externe Liquidität: High/Low der unmittelbar vorher vollständig abgeschlossenen Session.

### 4.2 1H-Bias

- Bullish: 1H-Close > EMA50 und EMA20 > EMA50.
- Bearish: 1H-Close < EMA50 und EMA20 < EMA50.
- Sonst neutral.
- Trendarm verlangt Übereinstimmung von Bias und Signalrichtung.

### 4.3 1H Supply/Demand-Origin

Eine bullish Origin-Zone ist die letzte bearish 1H-Candle vor einer bullish Displacement-Candle, deren Body >= 0,80 ATR(14) ist und deren Close über dem zu diesem Zeitpunkt jüngsten bestätigten 1H-Pivot-High liegt. Zone: Low bis Open der Origin-Candle. Bearish spiegelbildlich (Open bis High). Zone ist erst nach Close der Displacement-Candle gültig und verfällt nach einem 1H-Close jenseits ihrer Außenkante.

### 4.4 15m Sweep/Reclaim

Bullish:

1. Candle-Low unterschreitet ein zuvor bekanntes SSL-Level um mindestens 0,03 ATR(14),
2. dieselbe Candle schließt wieder über dem Level,
3. der Sweep ist höchstens 1,50 ATR tief.

Bearish spiegelbildlich an BSL. Externes Session-Level hat Vorrang; andernfalls darf das jüngste bestätigte interne Pivot verwendet werden. Ein Level kann je Session und Richtung nur einmal gehandelt werden.

### 4.5 Video-POI/Flip-Qualifikation

`poiQualified=true`, wenn die 15m-Sweep-Candle eine noch gültige 1H-Origin-Zone berührt oder wenn das gesweepte Level zuvor als Widerstand/Unterstützung gebrochen und anschließend von der Gegenseite erstmals retestet wird. Der Flip erfordert einen **damals bereits bestätigten** 15m-Close jenseits des Levels; bloßes optisches Nachzeichnen ist unzulässig.

### 4.6 5m Bestätigung

Innerhalb von 30 Minuten nach dem 15m-Sweep muss eine 5m-Candle:

- in Long-Richtung über das jüngste vor dem Sweep bestätigte 5m-Pivot-High schließen (Short: darunter),
- Body >= 0,50 ATR(14) besitzen,
- eine 3-Candle-FVG erzeugen: bullish `Low[t] > High[t-2]`, bearish `High[t] < Low[t-2]`.

FVG-Grenzen sind die beiden nicht überlappenden Wicks; Entry-Referenz ist deren 50%-Mitte.

### 4.7 1m Entry

Innerhalb von 20 Minuten nach der 5m-Bestätigung muss der Mittelpreis die FVG-Mitte erstmals berühren und eine 1m-Candle in Signalrichtung schließen. Entry am Open der nächsten verfügbaren 1m-Candle zum ausführbaren Bid/Ask plus Slippage. Kein Retest = kein Trade. Maximal zwei Entries je Markt/Session; kein zweiter Entry, solange eine Position offen ist.

## 5. Trend- und Countertrend-Arm

**Trendarm:** Signalrichtung entspricht 1H-Bias. `poiQualified` wird aufgezeichnet, ist aber in der preregistrierten Basis kein Pflichtfilter.

**Video-Countertrend-Arm (nur Ablation/Kandidat):** Gegen 1H-Bias nur erlaubt, wenn (a) externe Session-Liquidität gesweept wurde, (b) eine gültige passende 1H-Origin-Zone berührt wurde, (c) `poiQualified=true`, und (d) vollständige 5m/1m-Bestätigung vorliegt. Neutraler 1H-Bias zählt nicht als Countertrend.

## 6. Raum bis Ziel, Stop und Exits

- Vor Entry muss die nächste bereits bekannte gegengerichtete externe 15m-/Session-Liquidität mindestens 1R vom geplanten Entry entfernt liegen. Sonst kein Trade.
- Long-SL: Minimum aus Sweep-Low und berührter Demand-Außenkante minus 0,15 ATR(15m). Short spiegelbildlich.
- Zulässige Stopdistanz: 0,25 bis 5,00 ATR(15m). Außerhalb: kein Trade.
- TP1 = 1R (40%), TP2 = 2R (40%), TP3 = 3R (20% und **Full TP**).
- Nach TP1 wird der Stop des Restes auf tatsächlichen Entry-Breakeven inklusive modellierter Kosten gesetzt.
- Nach Entry wird der Stop niemals weiter vom Markt weg bewegt.
- Zwangsausgang am Ende der Entry-Session zum verfügbaren Bid/Ask, auch wenn kein Ziel erreicht wurde.

## 7. High-impact-News

Nur verifizierte, marktrelevante Hochrisikoereignisse:

- Alle Märkte: USD FOMC-Entscheid, CPI, PPI, Employment Situation/NFP.
- EURUSD zusätzlich: ECB-Zinsentscheidung.
- Basisfilter: kein neuer Entry von 60 Minuten vor bis 60 Minuten nach offizieller Veröffentlichungszeit.
- Ablationen: kein Filter, +/-30, +/-120 Minuten und kompletter Event-Tag.
- Ein nicht verifizierbarer Termin wird nicht geraten, sondern als fehlend protokolliert.

## 8. Zeitliche Forschungsaufteilung

- In-Sample: 2024-08-01 bis 2025-01-31 23:59:59 UTC.
- Walk-forward/Validation: 2025-02-01 bis 2025-04-30 23:59:59 UTC; Monatsfenster werden getrennt ausgewiesen.
- Final OOS: 2025-05-01 bis 2025-07-31 23:59:59 UTC.

Variantenwahl darf nur IS + Walk-forward verwenden. Nach schriftlichem Freeze wird die gewählte Variante genau einmal auf Final OOS ausgeführt. Falls das Mindestmaß von 200 Trades je Markt nur durch Lockerung nach Ansicht des OOS erreichbar wäre, gilt das Kriterium als **nicht erfüllt**; es wird nicht nachoptimiert.

## 9. Preregistered Ablationen

Jeweils exakt eine Änderung gegenüber der Basis:

1. FVG nicht Pflicht.
2. 1m-Retest durch Entry am nächsten 1m-Open nach 5m-MSS ersetzt.
3. `poiQualified` wird Pflicht.
4. Nur externe Session-Liquidität; keine internen Pivots.
5. 1H-Bias entfernt.
6. Countertrend-Arm zusätzlich erlaubt.
7. 4H-EMA-Bias (aus 1H aggregiert) zusätzlich Pflicht.
8. Newsfilter: keiner / 30 / 120 Minuten / ganzer Tag statt 60.
9. Gegenliquiditäts-Raumprüfung entfernt.
10. Video-V-Reaktion: 15m-Reclaim muss innerhalb von zwei 5m-Bars erfolgen.

Zusätzlich wird `MRWAGWAN_V3_REFERENCE_PROXY` berichtet: 0,08-ATR-Sweep nur an externer Vor-Session-Liquidität, Market-Entry nach Bestätigung, kompletter Red-News-Tag und keine neue Gegenliquiditäts-Raumprüfung. Da der neue Backtestkern zwingend 1H/15m/5m/1m und Bid/Ask-Ausführung nutzt, ist dies eine **Referenzprojektion**, keine Behauptung, alte historische Ergebnisse exakt zu replizieren. Sie ist nicht auswählbar.

Diagnostische Parameter-Nachbarschaften (dürfen nie ausgewählt werden): Sweep 0,02/0,04 statt 0,03 ATR, Displacement 0,40/0,60 statt 0,50 ATR und Stop-Puffer 0,10/0,20 statt 0,15 ATR. Sie werden nur auf IS + Walk-forward berechnet, um Klippen und Vorzeichenwechsel sichtbar zu machen.

Keine unregistrierte Variante darf Final OOS beeinflussen.

### 9.1 Vorab festgelegte Auswahlregel

Die Basis bleibt automatisch ausgewählt. Eine einzelne Ablation darf sie nur ersetzen, wenn sie im Walk-forward-Zeitraum gleichzeitig (a) mindestens 0,10R mehr Erwartungswert als die Basis erzielt, (b) im IS einen positiven Erwartungswert hat, (c) im Walk-forward insgesamt mindestens 100 Trades und je Markt mindestens 10 Trades besitzt und (d) in mindestens drei von fünf Märkten einen nicht-negativen Walk-forward-Erwartungswert zeigt. Erfüllen mehrere Varianten alles, gewinnt der höchste Median der fünf marktweisen Walk-forward-Erwartungswerte; Gleichstand geht an die Basis bzw. an die Variante mit weniger Regeländerungen. Es werden keine Ablationen kombiniert. Erfüllt keine Ablation alle Hürden, bleibt die Basis eingefroren — auch wenn eine kleine Stichprobe optisch besser aussieht.

## 10. Mindestkriterien und Statuslogik

Zielstichprobe: mindestens 1.000 abgeschlossene Trades insgesamt und mindestens 200 je Markt. Diese Zahl ist ein Stabilitätsziel, kein Anlass zum künstlichen Erzeugen von Trades.

Eine Variante kann nur **promising** heißen, wenn im Final OOS:

- Erwartungswert nach Kosten > 0R,
- Profit Factor > 1,05,
- mindestens drei der fünf Märkte nicht-negativen Erwartungswert zeigen,
- kein einzelner Markt mehr als 60% des Gesamtgewinns liefert,
- und die Parameter-Nachbarschaft keinen abrupten Vorzeichenwechsel zeigt.

Ohne diese Bedingungen lautet der Status **not validated** bzw. **rejected**. Selbst „promising“ ist keine Live-Freigabe.

## 11. Reproduzierbarkeit

Der Backtester speichert je Trade Signalzeiten und -levels, Session, Bias, Liquiditätsklasse, POI/FVG/MSS-Werte, Bid/Ask-Fills, Slippage, R-Exits, Newsdistanz, MFE/MAE, Haltedauer, Split und Regelversion. Rohdateien erhalten SHA-256-Prüfsummen. Quellcode, Konfiguration, Eventregister und erzeugtes JSON sind Teil des Research-Artefakts.

## 12. A+-Kriterien, verbotene Setups und Beispiele

### A+ (Qualitätslabel, kein zusätzlicher versteckter Filter)

Ein protokollierter Trade erhält nachträglich das deskriptive Label A+, wenn externe Vor-Session-Liquidität statt nur interner Liquidität gesweept wurde, 1H-Bias übereinstimmt, eine gültige 1H-Origin-Zone berührt wurde, 5m-MSS/Displacement/FVG vollständig vorliegen, Entry im passenden Discount (Long) bzw. Premium (Short) liegt, mindestens 2R Raum bis zur nächsten bekannten Gegenliquidität besteht und kein Red-News-Event am selben Sessionabschnitt liegt. Das Label darf Ergebnisse gruppieren, aber nicht rückwirkend Trades entfernen.

### Verboten

- Entry vor Abschluss der 15m-Sweep-Reclaim-Candle oder vor bestätigtem 5m-Pivotbruch.
- FVG/Order Block/Pivot mit späteren Kerzen rückdatieren.
- Stop nach Entry erweitern, Verlustposition nachkaufen oder Risiko nach einem Verlust erhöhen.
- Entry außerhalb Asia/London/New York, Cross-Session-Halten oder Entry im gesperrten Newsfenster.
- Signal zulassen, wenn SL-Geometrie, Datenlücke oder Bid/Ask-Seite nicht ausführbar ist.
- „Full Pot“, Recovery-Trade, Glaubenssatz oder Video-PnL als Signal/Risikobegründung.

### Mechanisches Long-Beispiel

Vorherige Session-Low = 2.400,00; 15m ATR = 4,00. Eine 15m-Candle handelt bis 2.399,70 (>0,03 ATR Sweep), schließt bei 2.400,40 zurück über dem Level. 1H ist bullish. Nach dem Sweep schließt eine 5m-Displacement-Candle mit mindestens 0,50 ATR über dem zuvor bestätigten 5m-Pivot und bildet eine bullish FVG. Innerhalb von 20 Minuten berührt der 1m-Mittelpreis die FVG-Mitte und schließt bullish; Entry erfolgt zum nächsten Ask plus Slippage. Stop liegt unter Sweep-/Demand-Invalidierung minus 0,15 ATR. TP1/TP2/TP3 liegen bei 1R/2R/3R, wobei TP3 Full TP ist. Das Beispiel illustriert die Reihenfolge, nicht ein reales Setup.

### Mechanisches Short-Beispiel

Spiegelbildlich: bestätigte BSL wird um mindestens 0,03 ATR überschritten und per 15m-Close zurückerobert, 1H ist bearish, 5m bricht ein vorher bestätigtes Pivot-Low mit Displacement/FVG, 1m retestet die FVG-Mitte, Entry zum nächsten Bid. Stop über Sweep-/Supply-Außenkante plus Puffer; Ziele 1R/2R/3R.

## 13. Nach-Test-Abschnitt

Die Backtestresultate werden nach Hash-Freeze und einmaligem Final-OOS-Lauf in `MRWAGWAN_HYBRID_RESULTS.md` und `MRWAGWAN_HYBRID_BACKTESTS.json` geschrieben. Dieser Regelteil bleibt unverändert; Ergebniszahlen werden nicht benutzt, um ihn rückwirkend umzuschreiben.

<!-- GENERATED_RESULTS_START -->
## 14. Generierter Ergebnisanhang

Noch nicht ausgeführt. Dieser Bereich wird erst nach dem eingefrorenen Final-OOS-Lauf automatisch ersetzt; er gehört nicht zum gehashten Regelteil.
<!-- GENERATED_RESULTS_END -->
