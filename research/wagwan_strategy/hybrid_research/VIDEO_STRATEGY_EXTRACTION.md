# Video Strategy Extraction — `AZlbhU1xG9A`

## Quellenstatus

- Video: [Making $1.1 MILLION Live Trading (STEAL THIS LIQUIDITY STRATEGY)](https://www.youtube.com/watch?v=AZlbhU1xG9A)
- Kanal: Brad Trades (Videoseite nennt zusätzlich zwei Collab-Kanäle)
- Veröffentlichungsdatum laut Videoseite: 19. August 2026
- Videolänge: 49:58
- Transkript: englische, automatisch erzeugte YouTube-Untertitel; vollständig von 00:00 bis 49:57 exportiert
- Beschreibung: keine Kapitel; Werbe-/Mentoring-Links und ein allgemeiner Risikohinweis, aber keine formale Strategiedefinition
- Rohtranskript: [`raw/youtube_AZlbhU1xG9A_transcript_auto_en.txt`](raw/youtube_AZlbhU1xG9A_transcript_auto_en.txt)

`EXPLIZIT` bedeutet: im Video wörtlich oder eindeutig erklärt. `ABGELEITET` bedeutet: aus mehreren Aussagen oder dem sichtbaren Chart rekonstruiert, aber nicht als vollständige Regel formuliert. `UNKLAR` bedeutet: nicht zuverlässig bestimmbar. Die Konfidenz bewertet nur die Extraktionssicherheit, nicht die Profitabilität.

## Kurzrekonstruktion

Das Video zeigt im Wesentlichen **einen EUR/USD-Long während der London-Session**. Nach einem starken Abverkauf verlangsamt sich das bearishe Momentum. Der Autor identifiziert eine extreme Demand-Zone und eine Flip-Zone, wartet auf Sweeps unter mehreren lokalen Tiefs und eine bullische Reaktion mit Imbalance/V-Form. Der Entry erfolgt im unteren Bereich; der ursprüngliche Stop wird später weiter unter die Demand-Zone verschoben. Ziel ist gemäß seiner Aussage die nächstgelegene 15-Minuten-Supply-Zone. Der Trade wird nahe dem Ziel manuell geschlossen.

## Behauptete Trade-Fakten

| Element | Extraktion | Status | Konfidenz | Zeitstempel |
|---|---|---|---:|---|
| Markt | EUR/USD (`EU`) | EXPLIZIT | hoch | [00:02](https://www.youtube.com/watch?v=AZlbhU1xG9A&t=2s) |
| Richtung | Long | EXPLIZIT | hoch | 00:02–00:25 |
| Session | London; Zielerreichung vor New York bevorzugt | EXPLIZIT | hoch | 00:05; 01:39–01:41; 25:35–25:47 |
| Primärer Analysechart | 5 Minuten; später beobachtet er auch 1 Minute sowie 1H/4H | EXPLIZIT | hoch | 03:20; 07:22–07:30; 26:23–27:55 |
| Entrypreis | Im Video grafisch sichtbar, aber im Transkript nicht zuverlässig genannt | UNKLAR | niedrig | 01:26–01:34 |
| Zielpreis | `1.15325` wird genannt; genaue Broker-Darstellung nicht unabhängig geprüft | EXPLIZIT | mittel | 24:24–24:32 |
| PnL | ca. 1,1 Mio. USD behauptet | EXPLIZIT als Behauptung, nicht extern verifiziert | hoch/niedrig | 37:47–39:15 |
| Risikobetrag | etwa 0,5 Mio. USD behauptet; unmittelbar nach „full pot“ relativiert | EXPLIZIT, inkonsistent | mittel | 36:50–36:59 |

Die Geldbeträge, Kontogröße und Echtheit der Ausführung sind nicht unabhängig verifiziert und werden nicht als Strategiebeweis verwendet.

## Marktlogik

### 1. Kontext und Bias

| Regel/Aussage | Klassifikation | Konfidenz | Evidenz |
|---|---|---:|---|
| Ein starker Abverkauf verliert an Momentum, Demand tritt in den Markt und eine Gegenbewegung wird wahrscheinlicher. | EXPLIZIT | hoch | 03:20–03:58 |
| Der Trade ist gegen die kleine äußere Swing-Struktur, aber mit der bullischen internen Struktur. | EXPLIZIT | hoch | 03:58–04:09 |
| 4H-Demand unterstützt die bullische Reaktion; 1H zeigt den Pullback aus dieser Zone. | EXPLIZIT | hoch | 27:05–27:24 |
| Der Trade ist ein Countertrend-Pullback und kein bestätigter vollständiger HTF-Trendwechsel. | ABGELEITET | hoch | 04:03–04:09 plus 27:27–27:42 |
| Ein objektiver Algorithmus für HTF-Bias, Swing-Pivots oder Trenddefinition wird geliefert. | UNKLAR/NEIN | hoch | Im gesamten Video fehlt eine formale Definition. |

### 2. Zonen

| Element | Rekonstruktion | Klassifikation | Konfidenz | Evidenz |
|---|---|---|---:|---|
| Extreme Demand-Zone | Zone am Ende des Abverkaufs nach Liquidity Sweep | EXPLIZIT | hoch | 05:00–05:04 |
| Flip-Zone | Frühere Supply reagiert zunächst, scheitert anschließend und soll später Buy-Orders enthalten | EXPLIZIT | hoch | 05:05–05:20 |
| Mitigation | Preis kehrt in Flip-/Demand-Bereich zurück und testet ihn | EXPLIZIT | hoch | 05:22–05:34 |
| „Institutional area/zone“ | Autor verwendet die Bezeichnung für die markierte Demand-/Flip-Region | EXPLIZIT | mittel | 11:21–11:32 |
| Order Block | Nicht sauber definiert; eine Gleichsetzung mit Demand oder Flip wäre Interpretation | UNKLAR | hoch | Begriff/Regel fehlt. |
| FVG | „Imbalance“ wird genannt, aber keine formale Drei-Kerzen-FVG-Grenze definiert | ABGELEITET/UNKLAR | mittel | 05:55–06:03 |

### 3. Liquidität und Struktur

| Regel/Aussage | Klassifikation | Konfidenz | Evidenz |
|---|---|---:|---|
| Mehrere Tiefs unterhalb des Preises bilden verfügbare Sell-Side-Liquidity. | EXPLIZIT | hoch | 00:07–00:16; 05:22–05:55 |
| Der Markt soll diese Tiefs sweepen, bevor genug „Fuel“ für die Aufwärtsbewegung vorhanden ist. | EXPLIZIT | hoch | 05:34–05:55 |
| V-förmige Reaktion plus bullische Bestätigung/Imbalance wird als Sweep-Bestätigung verwendet. | EXPLIZIT | hoch | 05:53–06:08 |
| Ein interner bullischer BOS soll den Market Shift bestätigen. | EXPLIZIT | hoch | 02:47–03:01 |
| Der nach dem Entry erwartete interne BOS ist zusätzliche Bestätigung und nicht eindeutig ein obligatorischer Vor-Entry-Trigger. | ABGELEITET | hoch | Entry besteht bereits vor 02:47; Entrybegründung 05:50–06:10. |
| Exakte BOS-/MSS-Regel, Schlusskurs-vs.-Wick-Regel und Pivotbreite | UNKLAR | hoch | Nicht formalisiert. |

## Entry-Modell

Rekonstruierter Ablauf:

1. Starker bearisher Impuls läuft in eine extreme Demand-/Flip-Region.
2. Bearishes Momentum verlangsamt sich.
3. Lokale Tiefs erzeugen Sell-Side-Liquidity.
4. Preis sweeped mehrere Tiefs und mitigiert den Point of Interest.
5. Eine V-förmige bullische Reaktion, Imbalance und bullische interne Bestätigung erscheinen.
6. Long-Entry im unteren Bereich; Ziel an der nächsten 15m-Supply.

Die Schritte 1–5 sind inhaltlich klar, aber das Video liefert **keine vollständig deterministische Entryformel**: keine Pivotparameter, keine minimale Sweep-Tiefe, keine Displacement-Schwelle, keine FVG-Mindestgröße, keine maximale Zahl an Bestätigungskerzen und keine eindeutige Orderart.

## Stop-Loss und Invalidierung

| Aussage | Klassifikation | Konfidenz | Bewertung |
|---|---|---:|---|
| Initialer Stop einige Pips unter einem relevanten Tief, mit Spread-Puffer | EXPLIZIT | mittel | 09:31–09:51; welches der sichtbaren Tiefs exakt gemeint ist, bleibt ohne hochauflösende Originaldatei unsicher. |
| Stop später weiter unter die Demand-Zone verschoben | EXPLIZIT | hoch | 14:43–16:14 |
| Begründung: Erst unter diesem tieferen Level sei die Long-Idee tatsächlich invalidiert | EXPLIZIT | hoch | 15:24–16:14 |
| Anfänger sollen die mechanische Regel „Stop nicht verschieben“ beibehalten | EXPLIZIT | hoch | 15:13–15:24 |
| Später: Nach Entry nichts verändern, weder SL noch TP | EXPLIZIT, widersprüchlich | hoch | 32:52–33:15 |

Die nachträgliche Stop-Ausweitung erhöht das ursprünglich geplante Geldrisiko, sofern die Positionsgröße nicht gleichzeitig reduziert wird. Eine solche Reduktion wird nicht dokumentiert. Diese Praxis ist daher **kein unverändert übernehmbarer Risikostandard**.

## Take-Profit und Exit

| Regel/Aussage | Klassifikation | Konfidenz | Evidenz |
|---|---|---:|---|
| Ziel ist die nächste Supply-Zone. | EXPLIZIT | hoch | 00:25–00:31 |
| Der Tradeplan verlangt die nächstgelegene 15m-Zone; die weiter entfernte 1H-Supply wird nicht gewählt. | EXPLIZIT | hoch | 27:49–28:15 |
| Standardmanagement: Set-and-forget bis TP/SL; nicht jede Kerze neu entscheiden. | EXPLIZIT | hoch | 29:23–33:24 |
| Früher Exit 1: sehr nahe am TP und neuer gegengerichteter BOS/Bestätigung. | EXPLIZIT | hoch | 33:37–34:09 |
| Früher Exit 2: vorher definierter Intraday-Deadline-/Session-/Tages-Endpunkt; kein Overnight/Weekend. | EXPLIZIT | hoch | 34:13–35:05 |
| Manuelles Schließen nahe Ziel wegen möglicher Slippage/Nichtausführung | EXPLIZIT | hoch | 37:12–37:46 |
| Teilgewinnsystem TP1/TP2/TP3 | UNKLAR/NEIN | hoch | Das Video zeigt im Kern ein Gesamtziel; keine regelbasierte Skalierung wird erklärt. |

## Risiko- und Psychologieregeln

### Verwertbare Prozessregeln

- Nach Verlustserien denselben validierten Plan unverändert ausführen; Einzelergebnisse sind Varianz (02:02–04:55; 13:46–14:40).
- Nur handeln, wenn das Setup erscheint; sonst nichts tun (24:38–24:50).
- Vor dem Trade Entry, Invalidierung und Ziel definieren; nach Entry nur auf neue objektive Information reagieren (29:45–31:37).
- Gewinner nicht systematisch vorzeitig beschneiden, wenn das System 1:3 plant (31:51–32:50).
- Nicht auf 1m-Fluktuationen überreagieren; bei Zweifeln HTF-Kontext prüfen (07:20–07:42; 26:02–27:08).

### Nicht als Risikoregel übernehmbar

- „Full pot“, sehr große behauptete Geldrisiken oder das Ziel, vorangegangene Verluste in einem Trade zurückzuverdienen (28:18–29:02; 36:50–36:59).
- Stop nach Entry ausweiten, ohne vorab definierte Re-Underwriting-Regel und ohne dokumentierte Positionsgrößenanpassung.
- Ergebnisgewissheit („it literally cannot go down“) oder spirituelle Gewissheit als Marktevidenz (17:14–17:29).

## News- und Sessionfilter

- London ist explizit der aktive Kontext.
- New York ist zunächst Deadline, später wird London/New-York-Overlap als Beschleunigung beschrieben.
- Ein High-Impact-Newsfilter, eine Makroliste oder ein Eventabstand werden im Video **nicht** definiert.
- Für den Hybrid darf daraus kein Newsfilter erfunden werden; die bestehende verifizierte Red-News-Regel bleibt ein separates MrWagwan-Modul.

## Sichtbare Chartbeobachtungen

Visuell geprüft wurden insbesondere die Sequenzen um 03:20–06:00. Sichtbar sind:

- ein ausgeprägter Abverkauf links;
- eine breite untere, blau markierte Demand-/Flip-Region;
- mehrere lokale Tiefs und kleinere graue Reaktionszonen;
- ein Long-Position-Tool mit Ziel in einer höher liegenden rötlichen Supply-Zone;
- gelbe Pfadmarkierungen zur Erklärung von Impuls, Pullback und Sweep.

Die sichtbare Auflösung reicht nicht aus, um alle Preislabels, exakten Candle-Grenzen oder eine regelkonforme FVG-Geometrie zweifelsfrei abzuschreiben. Solche Werte werden deshalb nicht erfunden.

## Vollständigkeits- und Widerspruchsaudit

| Thema | Ergebnis |
|---|---|
| Vollständige mechanische Strategie? | **Nein.** Ein einzelnes Fallbeispiel plus diskretionäre Erläuterung. |
| MTF-Idee? | **Ja**, aber Rollen und Übergangsregeln sind nicht vollständig formalisiert. |
| Liquidität/Sweep? | **Ja**, deutlich und mehrfach erklärt. |
| Demand/Flip/Mitigation? | **Ja**, deutlich erklärt. |
| BOS/MSS? | **Teilweise**, Begriffe ohne Algorithmus. |
| FVG? | **Nur Imbalance**, keine formale FVG-Regel. |
| Risiko pro Trade? | **Nein.** Nur behauptete Geldbeträge und riskante „full pot“-Sprache. |
| Stop-Regel? | **Widersprüchlich.** Erst nachträgliche Ausweitung, später „nicht bewegen“. |
| TP-Regel? | **Ja, teilweise:** nächste 15m-Supply; keine TP1/2/3-Verteilung. |
| Newsfilter? | **Nein.** |
| Statistischer Nachweis? | **Nein.** Ein Trade und anekdotische Aussagen ersetzen keinen Backtest. |

## Geforderte SMC-Begriffe: vollständige Abdeckung

| Begriff | Videoevidenz | Klasse | Confidence / Konsequenz |
|---|---|---|---|
| Trenddefinition | äußerer kleiner Swing bearish, interne Struktur bullish | EXPLIZIT, aber nicht algorithmisch | hoch; Pivotparameter UNCLEAR |
| Swing High/Low | sicht- und besprechbar, keine Fraktalbreite | INFERRED/UNCLEAR | mittel; nicht numerisch übernehmen |
| BOS | interner bullish BOS genannt | EXPLIZIT | hoch; Close/Wick-Regel UNCLEAR |
| CHoCH | kein eindeutig abgegrenzter CHoCH-Trigger | UNCLEAR | hoch |
| MSS | „market shift“/interner Bruch konzeptuell | EXPLIZIT/INFERRED | mittel-hoch; Timing teils nach Entry |
| Displacement | starke Reaktion/Imbalance | INFERRED | mittel; keine ATR-Schwelle |
| Protected High/Low | Invalidierung unter Low/Demand, Begriff nicht sauber definiert | INFERRED/UNCLEAR | mittel-niedrig |
| BSL | Gegenziel Supply, aber BSL-Begriff nicht mechanisch erklärt | INFERRED | niedrig-mittel |
| SSL | mehrere lokale Lows/Fuel | EXPLIZIT | hoch |
| Equal Highs/Lows | mehrere ähnliche Lows sichtbar/besprochen, Toleranz fehlt | INFERRED | mittel |
| externe/interne Liquidität | intern klarer als extern; keine formale Taxonomie | INFERRED | mittel |
| Session Liquidity | London-Kontext, aber keine Asia-/NY-High-/Low-Formel | EXPLIZIT/UNCLEAR | hoch |
| Sweep/Grab | Sweep unter lokalen Lows zentral | EXPLIZIT | hoch |
| Entry-Kontext | Demand/Flip-Mitigation nach Abverkauf | EXPLIZIT | hoch |
| Confirmation | V-Reaktion, Imbalance, bullish interne Bestätigung | EXPLIZIT | hoch, aber unvollständig parametrisiert |
| Retest | Mitigation/Retest der Zone | EXPLIZIT | hoch |
| FVG | nur „imbalance“, kein Drei-Candle-Algorithmus | INFERRED/UNCLEAR | mittel |
| Order Block | keine verifizierbare Definition | UNCLEAR | hoch |
| Breaker | Flip-Zone ähnelt funktional einem Breaker, wird aber nicht eindeutig so definiert | INFERRED | niedrig-mittel |
| Mitigation | Rückkehr in Flip-/Demand-Bereich | EXPLIZIT | hoch |
| Premium/Discount | keine 50%-Range oder klare Regel | UNCLEAR | hoch |
| Stop/Invalidierung | Stop unter Low/Demand; später erweitert | EXPLIZIT, widersprüchlich | hoch |
| RR | 1:3-Plan in Managementerklärung, aber gezeigte exakte Geometrie nicht vollständig lesbar | EXPLIZIT/UNCLEAR | mittel |
| Partials | keine regelbasierte TP1/2/3-Skalierung | UNCLEAR/NEIN | hoch |
| Break-even | keine vollständige mechanische Regel | UNCLEAR | hoch |
| Trailing | keine reproduzierbare Trailing-Regel | UNCLEAR | hoch |
| Time Exit | London/NY-Deadline, kein Overnight/Weekend | EXPLIZIT | hoch |
| Asia | nicht als bevorzugte Entry-Session des Trades definiert | UNCLEAR | hoch |
| London | aktive Entry-/Management-Session | EXPLIZIT | hoch |
| New York | Deadline/Overlap-Beschleunigung | EXPLIZIT | hoch |
| 1H/15m/5m/1m | 1H/4H Kontext, 15m Zielzone, 5m Analyse, 1m Beobachtung | EXPLIZIT | hoch; feste Rollengrenzen dennoch UNCLEAR |

## Extraktionsfazit

Der belastbare Kern ist ein **POI-Mitigation + Sell-Side-Liquidity-Sweep + interne bullische Bestätigung**-Modell mit zielgerichtetem Exit an der nächsten 15m-Supply. Die Video-Regeln sind jedoch diskretionär und in der Stop-Verwaltung widersprüchlich. Sie werden deshalb nicht direkt als finale Strategie behandelt, sondern nur als Hypothesen für isolierte Ablationstests.
