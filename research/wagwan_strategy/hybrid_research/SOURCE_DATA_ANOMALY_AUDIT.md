# Source Data Anomaly Audit — EURUSD 2024-10-09/10

Status: dokumentierte Warnung; kein stilles Repair, kein erneuter OOS-Lauf

## Befund

Der zusammengeführte Dukascopy-EURUSD-Datensatz enthält ausschließlich im Fenster ab `2024-10-09T23:09:00Z` bis einschließlich `2024-10-10T23:59:00Z`:

- 164 Minuten, in denen mindestens eine ASK-OHLC-Komponente unter der zugehörigen BID-Komponente liegt;
- 774 Minuten mit geometrisch unplausiblen OHLC-Werten, zum Beispiel einem Low oberhalb von Open oder Close.

Außerhalb dieses Fensters gibt es im gesamten 12-Monats-EURUSD-Datensatz keine solche Auffälligkeit.

## Unabhängiger Vergleich mit dem offiziellen Widget

Codex hat beide Preis-Seiten beider betroffenen UTC-Tage direkt über das offizielle Dukascopy Historical Data Export Widget exportiert. Vergleich gegen die decodierten JETTA-Minuten:

| UTC-Tag | Seite | Widget-Zeilen | decodierte Zeilen | Abweichungen |
|---|---:|---:|---:|---:|
| 2024-10-09 | BID | 1.437 | 1.437 | 0 |
| 2024-10-09 | ASK | 1.437 | 1.437 | 0 |
| 2024-10-10 | BID | 1.432 | 1.432 | 0 |
| 2024-10-10 | ASK | 1.432 | 1.432 | 0 |

Die vier Belegdateien liegen unter `raw/validation/`. Damit ist belegt, dass der Decoder den offiziellen Widget-Export exakt reproduziert. Der Befund ist eine Anomalie des gelieferten historischen Feeds, kein lokaler Decodefehler.

## Auswirkung auf die Tests

- Kein Trade der eingefrorenen Regelversion `BASE_HYBRID_PREREG_1_0` überlappt direkt das Anomaliefenster.
- Kein finaler OOS-Trade überlappt das Anomaliefenster; das Fenster liegt vollständig im IS.
- Zwei Entwicklungs-/Diagnosetrades überlappen direkt: `TEST-000717` (`DIAG_FREQUENCY_SIMPLIFIED_MSS`) und `TEST-000723` (`ABL_NO_H1_BIAS`).
- Der nächste EURUSD-Trade der final ausgewählten Basis nach dem Fenster beginnt erst am `2024-10-15T14:22:00Z`.

Die zwei betroffenen Entwicklungstests bleiben aus Gründen der Auditierbarkeit unverändert in der JSON-Datei, dürfen aber nicht als saubere unabhängige Performance-Evidenz interpretiert werden. Die Mindestabdeckung bleibt auch ohne diese zwei Beobachtungen weit über 1.000 gesamt und 200 je Markt.

## Entscheidung

Die Rohdaten und das bereits gehashte Ergebnis werden nicht nachträglich verändert. Der Validator akzeptiert die Datenquellentreue nur zusammen mit den vier exakten Widget-Belegen und erzeugt eine ausdrückliche Warnung. Der Strategiestatus bleibt unabhängig davon `NOT VALIDATED`, insbesondere wegen der zu kleinen finalen OOS-Stichprobe.
