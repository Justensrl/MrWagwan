# Strategy Status

**STRATEGY_STATUS: ORDERFLOW ONLY**

Stand: 2026-08-25

- Aktiv: `active/orderflow/**`
- Archiviert und nicht aktiv: alle in `archive/ict_smc/ARCHIVE_MANIFEST.md` erfassten Bestände
- Neue Trainingsserie: `OF_TRAINING_001`, Statistik startet bei 0
- Alte ICT-/SMC-Statistiken werden niemals mit Orderflow-Statistiken vermischt
- Keine echten Trades, Orders oder Alerts

## ACTIVE STRATEGY CHECK

Vor jeder künftigen Analyse ist intern zu prüfen:

1. Ist jede Begründung ausschließlich aus beobachtbarem Orderflow, Auction-Kontext und verifizierter Datenqualität abgeleitet?
2. Sind alte ICT-/SMC-Begriffe oder -Modelle als Begründung vollständig entfernt?
3. Sind benötigtes Footprint, Bid/Ask-Volumen, DOM, Tape und Feed tatsächlich verfügbar?

Nur bei dreimal **JA** darf die Analyse als Orderflow-Analyse fortgesetzt werden. Andernfalls lautet die Ausgabe: **„Diese Orderflow-Information ist mit dem aktuellen Feed nicht verifizierbar.“**
