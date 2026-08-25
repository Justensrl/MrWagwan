# MrWagwan Orderflow Setup Library

**Status:** RESEARCH ONLY — 0 VALIDATED SETUPS
**Regel:** ausschließlich Orderflow/Auction; keine archivierte ICT-/SMC-Konfluenz

## Gemeinsame Gates für jedes Setup

1. Datenstufe erfüllt die Setup-Anforderung.
2. Instrument, Exchange, Kontrakt, Session, Delay und Feed sind dokumentiert.
3. High-Impact-News-Fenster ist bekannt; keine Interpretation im verzerrten Release-Moment.
4. Auction-Kontext und Ort stehen vor dem Trigger fest.
5. Trigger, Invalidierung, Stop, Target und Zeit-Exit werden outcome-blind eingefroren.
6. Ein fehlendes Follow-through führt zu No Trade oder regelbasiertem Exit.

## Übersicht

| ID | Setup | Status | Mindestdaten | Confidence |
|---|---|---|---|---|
| OF-S01 | Absorption Reversal | CANDIDATE | A: Bid/Ask Footprint oder Tape; optional DOM | mittel |
| OF-S02 | Failed Auction Reversal | CANDIDATE | A für Footprint-Excess; B für TPO-Version | mittel |
| OF-S03 | Delta Divergence Reversal | CANDIDATE | A bevorzugt, B nur als Schätzung | niedrig–mittel |
| OF-S04 | Stacked Imbalance Continuation | NEEDS MORE DATA | A: echte diagonale Bid/Ask-Footprints | niedrig |
| OF-S05 | Value Area Rejection | CANDIDATE | echter Volume-/TPO-Profilefeed + Ausführungsbestätigung | mittel |
| OF-S06 | Value Area Acceptance Continuation | CANDIDATE | Profil + mehrere Akzeptanz-/Follow-through-Beobachtungen | mittel |
| OF-S07 | POC Reclaim / Rejection | CANDIDATE | Sessionprofil + Delta/Tape-Bestätigung | niedrig–mittel |
| OF-S08 | Exhaustion Reversal | CANDIDATE | Tape oder Footprint, A bevorzugt | niedrig–mittel |
| OF-S09 | Trapped Buyer / Seller | NEEDS MORE DATA | A: Footprint/Tape und Reaktion | niedrig |
| OF-S10 | Initiative Breakout with Follow-through | CANDIDATE | Profil + aggressives Ausführungsvolumen | mittel |

## OF-S01 — Absorption Reversal

- **Kontext:** Preis testet einen vorab definierten Auction-Referenzpunkt außerhalb oder am Rand von Value.
- **Benötigte Daten:** echte Trades am Bid/Ask; Tape oder Footprint. DOM allein genügt nicht.
- **Voraussetzungen:** wiederholte aggressive Ausführung in eine Richtung, aber unverhältnismäßig wenig Preisfortschritt; Level hält mehrfach.
- **Entry-Trigger:** erst nach sichtbarem Scheitern des aggressiven Pushs und gegengerichtetem Follow-through.
- **Confirmation:** Delta dreht oder aggressives Tape wechselt; Preis akzeptiert wieder auf der Gegenseite des Levels.
- **Invalidierung:** erneute Initiative durch das Level mit Akzeptanz und Follow-through.
- **Stop:** jenseits des absorbierenden Auction-Extrems plus Tick-/Volatilitätspuffer.
- **Targets:** nächster HVN/POC, Value-Rand oder gegenüberliegender Auction-Referenzpunkt.
- **Typische Fehler:** hohes Volumen mit Absorption gleichsetzen; gegen ungebremste Initiative antizipieren.
- **Nicht handeln:** Release-Spike, unbekannter Feed, kein gegengerichtetes Follow-through.
- **Beispiel:** hypothetisch: starke Market-Sells am VAL, Low expandiert kaum; Käufer übernehmen Tape und Preis akzeptiert zurück in Value.
- **Quellen:** Sierra Numbers Bars; Bookmap Absorption/Exhaustion; Axia/Jigsaw als Lehrquellen.
- **Confidence:** mittel; Regeln testbar, Profitabilität unbewiesen.

## OF-S02 — Failed Auction Reversal

- **Kontext:** Auktion versucht Price Discovery außerhalb eines etablierten Bereichs.
- **Daten:** TPO/Volume Profile; für „finished/unfinished auction“ echte Price-Level-Footprints.
- **Voraussetzungen:** Extension außerhalb Value, keine Akzeptanz, schwacher oder ausbleibender Folgehandel.
- **Trigger:** Rückkehr und Halten innerhalb der vorherigen Auction-Referenz; aggressiver Gegenfluss bestätigt.
- **Confirmation:** Value-Reentry, abnehmende ursprüngliche Aggression, Gegeninitiative.
- **Invalidierung:** erneute Akzeptanz außerhalb des Bereichs.
- **Stop:** jenseits des fehlgeschlagenen Auction-Extrems.
- **Targets:** POC, gegenüberliegender Value-Rand, nächster HVN.
- **Fehler:** jeden Docht als Failed Auction bezeichnen; Akzeptanz nicht abwarten.
- **Nicht handeln:** Value ist selbst instabil oder Profildefinition unklar.
- **Beispiel:** hypothetischer Ausbruch über VAH, rasche Rückkehr, keine neue Value-Bildung außerhalb, Seller-Follow-through.
- **Quelle:** TradingView TPO/Profiles; Dalton; FuturesTrader71.
- **Confidence:** mittel.

## OF-S03 — Delta Divergence Reversal

- **Kontext:** nur an relevantem Auction-Ort, niemals mitten in zufälliger Rotation.
- **Daten:** konsistent berechnetes Delta/CVD mit dokumentiertem Reset und Feed.
- **Voraussetzungen:** Preis erreicht neues Extrem, Delta/CVD bestätigt nicht; zusätzlich fehlender Preisfortschritt.
- **Trigger:** Gegenseitige Initiative oder Acceptance zurück über/unter Referenz.
- **Confirmation:** Divergenz bleibt nach Barabschluss bestehen; Preisreaktion und Tape/Footprint stimmen überein.
- **Invalidierung:** Preis und Delta setzen gemeinsam in ursprünglicher Richtung fort.
- **Stop/Targets:** jenseits Extrem; nächster POC/Value-Rand.
- **Fehler:** Aggregationsartefakt, falscher CVD-Reset, Divergenz ohne Ort/Trigger.
- **Nicht handeln:** TradingView-Schätzung repaintet oder Feed wechselt.
- **Beispiel:** Preis tiefer, Sell-Delta schwächer, kein Follow-through, dann aggressive Käufer und Value-Reentry.
- **Quelle:** TradingView Delta-Methodik; Sierra CVD; Jigsaw.
- **Confidence:** niedrig–mittel.

## OF-S04 — Stacked Imbalance Continuation

- **Kontext:** bestätigte Price Discovery, nicht überdehnter Endpunkt.
- **Daten:** echte diagonale Bid/Ask-Volumenwerte pro Preislevel.
- **Voraussetzungen:** mehrere benachbarte Imbalances in Initiativrichtung plus tatsächlicher Preisfortschritt.
- **Trigger:** kontrollierter Rücktest/Stillstand, danach erneutes aggressives Follow-through.
- **Confirmation:** Imbalances bleiben nicht bloß optisch; Gegenaggression wird nicht absorbierend dominant.
- **Invalidierung:** Akzeptanz zurück durch den Imbalance-Cluster.
- **Stop/Targets:** hinter Cluster/letzter Akzeptanz; nächster LVN/HVN oder Discovery-Ziel.
- **Fehler:** Community-Footprint als echte Bid/Ask-Daten behandeln; 300%-Schwelle ungeprüft übernehmen.
- **Nicht handeln:** Einzelcluster ohne Kontext, dünner Markt, Feed B/C/X.
- **Beispiel:** hypothetischer Value-Break mit mehreren Ask-Imbalances, Pullback hält oberhalb, neues Ask-Follow-through.
- **Quelle:** Sierra diagonal imbalance; TradingView Footprint-Algorithmus.
- **Confidence:** niedrig; NEEDS MORE DATA.

## OF-S05 — Value Area Rejection

- **Kontext:** Preis testet VAH oder VAL eines sauber definierten Session-/Composite-Profils.
- **Daten:** zuverlässiges Profil; für Entry zusätzlich Delta/Tape/Footprint.
- **Voraussetzungen:** Test außerhalb Value wird nicht akzeptiert; responsive Seite stoppt Fortschritt.
- **Trigger:** Rückkehr in Value und bestätigtes Follow-through zum Inneren.
- **Confirmation:** Value wandert nicht in Ausbruchsrichtung; POC bleibt stabil oder migriert zur Rejection.
- **Invalidierung:** neue Value-Bildung außerhalb.
- **Stop:** jenseits Rejection-Extrem.
- **Targets:** POC zuerst, optional gegenüberliegender Value-Rand.
- **Fehler:** VAH/VAL als starre Linie; Profil aus ungeeignetem Tickvolumen verabsolutieren.
- **Nicht handeln:** direkt vor High-Impact-News oder ohne Ausführungsbestätigung.
- **Quelle:** TradingView Volume Profile; Dalton/FuturesTrader71.
- **Confidence:** mittel.

## OF-S06 — Value Area Acceptance Continuation

- **Kontext:** Markt etabliert Value außerhalb eines vorherigen Bereichs.
- **Daten:** developing Session/Composite Profile und Ausführungsfluss.
- **Voraussetzungen:** Zeit und Volumen bauen außerhalb Value auf; POC/Value migrieren; Rückkehrversuche scheitern.
- **Trigger:** erneute Initiative in Richtung der Value-Migration nach einem akzeptierten Test.
- **Confirmation:** mehrere Beobachtungen statt Einzelprint; Follow-through und stabile neue Value.
- **Invalidierung:** Rückkehr und Akzeptanz in alter Value.
- **Stop:** hinter neuer Acceptance-Struktur.
- **Targets:** nächster HVN/LVN-Übergang oder fortlaufende Discovery mit Trailing-Regel.
- **Fehler:** kurzen Spike als Acceptance werten.
- **Nicht handeln:** Profil noch zu jung oder News verzerrt Aufbau.
- **Quelle:** TPO/Volume Profile; Dalton; TradingView.
- **Confidence:** mittel.

## OF-S07 — POC Reclaim / Rejection

- **Kontext:** POC ist ein beobachteter Volumenschwerpunkt, kein magischer Support.
- **Daten:** Session-/Composite-Profil plus Delta/Tape.
- **Voraussetzungen:** Preis interagiert wiederholt mit POC; klarer Wechsel zwischen Akzeptanz und Ablehnung.
- **Trigger:** Reclaim mit Halten und Folgeaggression oder Rejection mit fehlgeschlagenem Durchbruch.
- **Confirmation:** POC-Migration und Value müssen zur Richtung passen.
- **Invalidierung:** Rückakzeptanz auf Gegenseite.
- **Stop/Targets:** jenseits der Reclaim-/Rejection-Range; Value-Rand/HVN.
- **Fehler:** POC isoliert handeln; unterschiedliche Profilperioden vermischen.
- **Nicht handeln:** überlappende Profile ohne festgelegte Referenz.
- **Quelle:** TradingView Profile-Dokumentation.
- **Confidence:** niedrig–mittel.

## OF-S08 — Exhaustion Reversal

- **Kontext:** reife Initiative am Auction-Extrem.
- **Daten:** Tape-Geschwindigkeit/Größe oder Footprint, vorzugsweise Stufe A.
- **Voraussetzungen:** frühere Aggression nimmt sichtbar ab; Folgeausführungen fehlen; Extension verkürzt sich.
- **Trigger:** Gegenaggression und Rückakzeptanz, nicht bloß Volumenabnahme.
- **Confirmation:** kein unmittelbarer neuer Push; Gegenseite erreicht Preisfortschritt.
- **Invalidierung:** ursprüngliche Aggression kehrt mit Fortschritt zurück.
- **Stop/Targets:** hinter Extrem; POC oder Value-Rand.
- **Fehler:** ruhigen Markt mit Exhaustion verwechseln; ohne Kontext Bottom/Top picken.
- **Nicht handeln:** illiquide Pause oder Feed-Lücke.
- **Quelle:** Bookmap; Jigsaw.
- **Confidence:** niedrig–mittel.

## OF-S09 — Trapped Buyer / Seller

- **Kontext:** aggressive Teilnehmer handeln am Extrem, der Markt kann ihre Richtung nicht halten.
- **Daten:** echte aggressor-seitig klassifizierte Trades plus anschließende Reaktion.
- **Voraussetzungen:** auffällige Aggression, kein Fortschritt, schnelle Rückkehr durch Ausführungsbereich.
- **Trigger:** Gegenseite übernimmt mit Follow-through; nicht aus bloßer Vermutung über Positionen.
- **Confirmation:** erneuter Test scheitert, Delta/Preisreaktion konsistent.
- **Invalidierung:** Rückgewinn des Extrembereichs durch ursprüngliche Seite.
- **Stop/Targets:** jenseits Trap-Extrem; Value/POC oder nächster Volumenknoten.
- **Fehler:** Teilnehmerpositionen behaupten, die Daten nicht zeigen.
- **Nicht handeln:** keine echte Bid/Ask-Klassifikation.
- **Quelle:** Jigsaw/Bookmap/Axia als Konzeptquellen.
- **Confidence:** niedrig; NEEDS MORE DATA.

## OF-S10 — Initiative Breakout with Follow-through

- **Kontext:** Balance mit klarer Value; neue Seite übernimmt Price Discovery.
- **Daten:** Profil plus aggressives Ausführungsvolumen, optional DOM/Tape.
- **Voraussetzungen:** Break außerhalb Value, Aggression erzeugt echten Fortschritt, Value beginnt zu migrieren.
- **Trigger:** Halten außerhalb oder kontrollierter Test mit erneuter Initiative.
- **Confirmation:** keine sofortige Rückakzeptanz; Folgevolumen und Preis reagieren gleichgerichtet.
- **Invalidierung:** Failed Auction zurück in Balance.
- **Stop:** hinter Acceptance-/Break-Bereich.
- **Targets:** nächster Composite-Knoten; bei Discovery regelbasiertes Trailing.
- **Fehler:** erstes Überschreiten handeln; hohes Delta ohne Preisfortschritt ignorieren.
- **Nicht handeln:** illiquider News-Spike oder bereits extreme Extension.
- **Quelle:** Auction-Quellen, CME-Mikrostruktur, Axia/Jigsaw.
- **Confidence:** mittel.

## Validierungsregel

Kein Setup wird `ACTIVE/VALIDATED`, bevor Datenintegrität, mindestens ein vorab registriertes Testdesign, Walk-Forward, OOS und realistische Kosten bestanden sind. Aktuell beträgt die validierte Trefferquote für jedes Setup: **nicht vorhanden**.
