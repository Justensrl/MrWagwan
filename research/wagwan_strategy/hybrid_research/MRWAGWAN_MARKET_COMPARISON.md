# MrWagwan Hybrid — Marktvergleich

Ranking nach **finalem OOS-Erwartungswert nach Kosten**. Bei kleinen oder überlappenden Unsicherheitsintervallen ist die Rangfolge nicht stabil.

| Rang | Markt | Instrument/Proxy | OOS Trades | OOS ØR | 95%-Intervall ØR | OOS PF | Win-Rate | Max DD R | Bewertung |
|---:|---|---|---:|---:|---|---:|---:|---:|---|
| 1 | SP500 | Dukascopy USA500IDXUSD CFD | 3 | -0.26 | -1.06 bis 0.54 | 0.28 | 66.7% | 1.07 | zu kleine OOS-Stichprobe |
| 2 | XAUUSD | Dukascopy XAUUSD | 4 | -0.37 | -1.16 bis 0.42 | 0.31 | 50.0% | 1.78 | zu kleine OOS-Stichprobe |
| 3 | EURUSD | Dukascopy EURUSD | 4 | -0.49 | -1.17 bis 0.19 | 0.18 | 25.0% | 2.41 | zu kleine OOS-Stichprobe |
| 4 | BTCUSD | Dukascopy BTCUSD | 6 | -0.62 | -1.46 bis 0.22 | 0.22 | 33.3% | 3.74 | zu kleine OOS-Stichprobe |
| 5 | NASDAQ | Dukascopy USATECHIDXUSD CFD | 6 | -1.11 | -1.13 bis -1.08 | 0.00 | 0.0% | 6.63 | zu kleine OOS-Stichprobe |

## Interpretation

- Das Ranking ist deskriptiv, keine Kauf-/Verkaufsempfehlung.
- NQ/NASDAQ und ES/SP500 wurden wegen frei reproduzierbarer Bid/Ask-Historie durch CFD-Indizes vertreten. Futures-spezifische Roll-, Tick-, Kommissions- und RTH-Effekte bleiben offen.
- BTCUSD handelt am Wochenende; die gleichen Berlin-Sessions werden trotzdem erzwungen. Das macht den Markt vergleichbar, aber nicht identisch zu institutionellen FX-/Indexbedingungen.
- Ein Markt mit positivem Gesamtwert und negativem Final OOS gilt nicht als robust. Final OOS hat Vorrang vor Gesamtwert.
