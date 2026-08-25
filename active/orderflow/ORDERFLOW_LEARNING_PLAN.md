# Orderflow Learning Plan

**Coach-Modus:** Codex lehrt, prüft und entscheidet über Progression.
**Start:** Level 0, danach Level 1.
**Training:** historische Daten, keine echten Orders/Alerts.

## Level 0 — Datenkompetenz

Ziel: Der Schüler kann sagen, was der Feed wirklich zeigt.

- zentraler Exchange versus CFD/Spot-FX
- Trade Volume versus Tick Volume
- ausgeführte Trades versus resting liquidity
- Bid/Ask-Klassifikation versus Intrabar-Schätzung
- Echtzeit, Delay, historische Ticktiefe, Kontraktroll
- DOM-/Tape-/Footprint-Anforderungen

**Prüfung:** Für drei Symbole Datenstufe A/B/C/X korrekt bestimmen. Keine Progression bei Halluzination von Bid/Ask-Volumen.

## Level 1 — Orders und Delta-Grundlagen

- Limit Order, Market Order, Bid, Ask, Spread, Tick Size
- aggressiver Käufer/Verkäufer; passiver Anbieter
- traded volume, Bid Volume, Ask Volume
- Bar Delta, Session Delta, CVD und Reset
- warum `positives Delta = Long` falsch ist

**Übungen:** einzelne Bars/Tape-Sequenzen beschreiben, ohne Tradeentscheidung.
**Bestehen:** mindestens 80 % Begriffs- und Datenquellen-Genauigkeit in 10 Beispielen.

## Level 2 — Footprint und Ausführungsreaktion

- Bid×Ask, diagonal imbalance, stacked imbalance
- POC pro Bar, total volume, delta percentage
- Absorption versus hohes Volumen
- Exhaustion versus illiquide Ruhe
- Price/Delta disagreement
- finished/unfinished auction und excess nur bei geeigneten Daten

**Übungen:** Ursache, beobachtbare Evidenz und alternative Erklärung getrennt nennen.
**Bestehen:** keine Einzel-Signal-Entries; 8/10 korrekte Kontexturteile.

## Level 3 — Auction Market Theory und Profile

- Balance/Imbalance, Price Discovery
- Value Area, POC, VAH, VAL
- HVN/LVN, developing/naked POC, Session/Composite Profile
- Acceptance, Rejection, Value-Migration
- initiative versus responsive participation

**Übungen:** Profile lesen, bevor Footprint eingeblendet wird.
**Bestehen:** Auction-Hypothese plus klare Falsifikationsbedingung in 8/10 Fällen.

## Level 4 — DOM und Tape

- Market by Price versus Market by Order
- Queue, resting liquidity, pulling, stacking
- Icebergs als Hypothese, nicht Behauptung
- Spoofing-Risiko und Book-Flüchtigkeit
- Tape speed, size, repeated prints, aggressive Ausführung

**Voraussetzung:** historischer/realtime Depth- und Tape-Feed. Ohne ihn bleibt Level 4 Theorie.
**Bestehen:** DOM-Ereignis plus ausgeführte Bestätigung unterscheiden.

## Level 5 — Setups, Risiko und No Trade

- nur Setup-Bibliothek OF-S01 bis OF-S10
- Kontext → Ort → Trigger → Confirmation → Invalidierung
- Stop hinter Auction-Invalidierung
- Targets an Value/POC/HVN/LVN/Discovery
- Zeit-Exit, News-Gate, fehlendes Follow-through
- No Trade als professionelle Entscheidung

**Bestehen:** 20 outcome-blinde Replay-Pläne, Prozessscore ≥ 8/10 und keine Datenregelverletzung.

## Level 6 — Research und Replay

1. Hypothese präregistrieren.
2. Daten- und Feedmanifest einfrieren.
3. In-Sample nur für Regelklarheit.
4. Walk-Forward ohne rückwirkende Anpassung.
5. echtes OOS.
6. Gebühren, Spread, Slippage, Roll und Delay.
7. Robustheit nach Markt, Session, Volatilität und Newsregime.

Keine Setup-Hochstufung aufgrund eines einzelnen Videos, Trades oder Gewinnergebnisses.

## Format neuer Übungen

- ID: `OF_TRAINING_001`, fortlaufend
- mögliche Entscheidung: Long, Short oder No Trade
- Pflichtfelder: Markt, Exchange/Feed, Kontrakt, Zeit, Session, Datenstufe, Auction-Kontext, beobachteter Flow, Setup-ID, Entry-Trigger, Stop, Invalidierung, Targets, Newsstatus, Ergebnis in R, Prozessreview
- Lösung bleibt bis `Fertig` verborgen
- Replay wird nicht zugunsten der Analyse manipuliert

## Unmittelbarer nächster sinnvoller Schritt

`OF_TRAINING_001` soll eine reine Level-0/1-Datenleseübung mit `MRWAGWAN_ORDERFLOW_CORE` auf `CME_MINI_DL:NQ1!`, 5m sein. Der Schüler muss den Feed als verzögert und das CVD als Intrabar-Schätzung benennen. Erst danach werden VWAP-Lage, CVD versus Preisfortschritt und Follow-through bewertet. Footprint-/DOM-/Tape-Aufgaben bleiben gesperrt, bis die benötigten Daten praktisch verfügbar sind.
