# Orderflow Glossary

| Begriff | Arbeitsdefinition | Wichtige Grenze |
|---|---|---|
| Ask | niedrigster sichtbarer Verkaufspreis | sichtbare Größe kann geändert/gezogen werden |
| Ask Volume | ausgeführtes Volumen, das am Ask klassifiziert wird | braucht passende Trade-Klassifikation |
| Bid | höchster sichtbarer Kaufpreis | nicht mit ausgeführtem Kaufvolumen verwechseln |
| Bid Volume | ausgeführtes Volumen, das am Bid klassifiziert wird | typischerweise aggressive Verkäufe |
| Market Order | sofort ausführbare Order gegen ruhende Liquidität | Ausführung kann mehrere Levels konsumieren |
| Limit Order | Order mit Preisgrenze, kann im Buch ruhen | sichtbare Absicht ist keine garantierte Ausführung |
| Aggressive Buyer | nimmt Angebote am Ask | positives Delta allein beweist keine Fortsetzung |
| Aggressive Seller | verkauft in Bids | negatives Delta allein beweist keine Fortsetzung |
| Passive Liquidity | ruhende Limit-Orders | kann gezogen, ergänzt oder verborgen sein |
| Initiative Activity | Teilnahme treibt Preis aus akzeptiertem Bereich | braucht Preisfortschritt/Acceptance |
| Responsive Activity | Teilnahme reagiert an Auction-Extrem und drängt zurück | nicht automatisch Reversal |
| Footprint / Numbers Bars | Volumen pro Preislevel innerhalb eines Bars | Methodik und Datenfeed prüfen |
| Bid × Ask | am Bid/Ask klassifiziertes ausgeführtes Volumen je Level | nicht dasselbe wie DOM-Größen |
| Delta | Ask Volume minus Bid Volume | Vorzeichen ist kein Signal |
| Bar Delta | Delta innerhalb eines Bars | Aggregation beeinflusst Aussage |
| Session Delta | Delta einer definierten Session | Sessiongrenze dokumentieren |
| CVD | kumulierte Folge von Delta-Werten | Reset, Feed und Klassifikation müssen konstant sein |
| Delta Divergence | Preis und Delta/CVD erreichen unterschiedliche Extremdynamik | nur Hypothese, Kontext/Trigger erforderlich |
| Imbalance | deutlich ungleiches Bid-/Ask-Volumen | Schwelle und Vergleichsmethode dokumentieren |
| Diagonal Imbalance | Ask eines Levels wird mit Bid darunter verglichen bzw. umgekehrt | nur mit granularen Daten belastbar |
| Stacked Imbalance | mehrere benachbarte Imbalances | kein Auto-Continuation-Signal |
| Absorption | aggressive Ausführung erzeugt wegen passiver Gegenliquidität wenig Fortschritt | hohes Volumen allein genügt nicht |
| Buy Absorption | aggressive Verkäufe werden von passiven Käufern aufgenommen | Bezeichnung bezieht sich auf absorbierende Seite |
| Sell Absorption | aggressive Käufe werden von passiven Verkäufern aufgenommen | braucht anschließende Reaktion |
| Exhaustion | Aggression/Fortsetzung trocknet am Extrem aus | nicht mit normaler Inaktivität verwechseln |
| Excess | Auction-Ende mit klar auslaufender Gegenaktivität | Definition plattformabhängig |
| Finished Auction | Extrem zeigt erwartete Abschlusscharakteristik | braucht Price-Level-Daten |
| Unfinished Auction | Extrem besitzt weiter beidseitige Aktivität | kein garantierter Magnet |
| DOM | aktuelle sichtbare Markttiefe/Orderbuch | dynamisch, feed- und brokerabhängig |
| Market by Price | aggregierte Menge je Preislevel | keine individuellen Queue-Positionen |
| Market by Order | einzelne anonyme Orders und Queue-Information | hoher Datenbedarf; nicht überall verfügbar |
| Pulling | sichtbare Liquidität wird entfernt | Motiv unbekannt |
| Stacking | sichtbare Liquidität wird ergänzt | kann echt oder irreführend sein |
| Spoofing | Orderabsicht, die vor Ausführung storniert/modifiziert werden soll, um zu täuschen | illegale Praxis; nicht aus Einzelmoment sicher diagnostizierbar |
| Tape / Time & Sales | Trade-by-Trade-Historie mit Zeit, Preis und Größe | Filter/Aggregation verändern Wahrnehmung |
| Tape Speed | Frequenz der Prints | News/Algorithmen können sie verzerren |
| Repeated Prints | wiederholte Ausführungen an/nahe einem Level | ohne Preisreaktion mehrdeutig |
| Iceberg | nur Teil einer größeren Order ist sichtbar | Erkennung bleibt meist inferenziell |
| Auction | Prozess, in dem Preis Gegenparteien sucht und Handel erleichtert | Modell, kein mechanisches Entry-Signal |
| Balance | Handel konzentriert sich um akzeptierten Value | kann abrupt in Discovery übergehen |
| Imbalance / Price Discovery | Preis sucht neuen akzeptierten Bereich | nicht jede schnelle Kerze ist nachhaltige Discovery |
| Acceptance | Zeit/Volumen und wiederholter Handel etablieren einen Bereich | Schwellen müssen präregistriert werden |
| Rejection | Markt verweigert Aufenthalt und kehrt zurück | einzelner Docht reicht nicht |
| Value Area | Profilbereich mit definiertem Anteil der Aktivität, häufig 70 % | Berechnung/Volume-Typ dokumentieren |
| POC | Preislevel mit höchstem Profilvolumen/TPO je Definition | kein magisches Support-/Resistance-Level |
| VAH / VAL | oberer/unterer Value-Area-Rand | dynamisch bei developing profile |
| HVN | High Volume Node, akzeptierter Volumenknoten | rückblickend/deskriptiv |
| LVN | Low Volume Node, Bereich geringer Aktivität | kann schnell durchlaufen oder abweisen |
| Developing POC | während der Session wandernder POC | instabil, solange Profil wächst |
| Naked POC | historischer POC, den Preis später nicht erneut berührt hat | Magnetwirkung ist zu testen, nicht anzunehmen |
| Composite Profile | Profil über mehrere definierte Sessions/Perioden | Auswahl darf nicht nach Ergebnis erfolgen |
| Session Profile | Profil einer klar definierten Session | ETH/RTH und Zeitzone angeben |
| Value Migration | POC/Value verschieben sich über Zeit | Richtung plus Acceptance prüfen |
| Failed Auction | Discovery-Versuch findet keine Akzeptanz und kehrt zurück | braucht vorab definierte Referenz |
| Follow-through | nach Trigger setzt die erwartete Seite Preisfortschritt/Acceptance fort | fehlt es, verliert Setup Gültigkeit |
| Trapped Participant | aggressive Seite kann ihren Ausführungsbereich nicht halten | Positionen nicht direkt beobachtbar; nur Hypothese |
| Data Tier | A/B/C/X-Klassifikation der Datenqualität | Teil der Strategie, nicht optional |
