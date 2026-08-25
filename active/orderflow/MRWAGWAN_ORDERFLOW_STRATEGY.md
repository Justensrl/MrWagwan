# MrWagwan Orderflow Strategy

**Status:** ACTIVE RESEARCH FRAMEWORK — NOT VALIDATED FOR LIVE TRADING
**Strategie:** ORDERFLOW ONLY
**Version:** 0.1.0-research
**Stand:** 2026-08-25

## 1. Zweck

Dieses Regelwerk interpretiert den Markt als laufende Auktion. Entscheidungen müssen aus tatsächlich verfügbarer Information über ausgeführtes Volumen, aggressive und passive Teilnahme, Value, Akzeptanz/Ablehnung und Follow-through entstehen. Ein Einzelwert wie positives Delta oder hohes Volumen ist niemals allein ein Entry.

Die frühere ICT-/SMC-Strategie ist archiviert. Ihre Begriffe, Levels und Konfluenzmodelle sind keine aktive Evidenz.

## 2. Datengate — vor jeder Analyse zwingend

| Stufe | Daten | Zulässige Nutzung |
|---|---|---|
| A | zentraler Exchange-Feed, echte Trades am Bid/Ask, Tick-Historie; für DOM-Setups zusätzlich Markttiefe | Footprint-, Delta-, Tape- und DOM-Hypothesen testbar |
| B | echter Exchange-Trade-Volume-Feed, aber Delta/Footprint aus Intrabar-Richtung geschätzt | Profile und grober Aggressionsproxy; als Schätzung kennzeichnen |
| C | CFD-/Spot-FX-Tickvolumen oder aggregierte OHLCV ohne echte Bid/Ask-Klassifikation | nur deskriptiver Preis-/Aktivitätskontext; keine echte Orderflow-Bestätigung |
| X | Feed/Entitlement/Methodik unbekannt | keine Orderflow-Aussage; Daten zuerst klären |

Wenn die für ein Setup benötigte Stufe fehlt, gilt: **„Diese Orderflow-Information ist mit dem aktuellen Feed nicht verifizierbar.“**

## 3. Bevorzugte Märkte

1. CME/CBOT/COMEX/NYMEX Futures mit passendem Echtzeit- und Bid/Ask-Feed, insbesondere NQ/MNQ, ES/MES und GC/MGC.
2. Bitcoin nur exchange-spezifisch, beispielsweise ein einzelnes Coinbase- oder Binance-Orderbuch. Niemals als vollständiger Gesamtmarkt bezeichnen.
3. Spot-FX besitzt keinen zentralen Gesamtfeed. Für Euro, Pfund usw. sind CME-FX-Futures bevorzugte Proxies; Basis-, Session- und Kontraktunterschiede sind zu dokumentieren.
4. CFDs wie `TVC:USOIL` oder `OANDA:XAUUSD` sind keine kanonische Quelle für echtes zentralisiertes Orderflow.

## 4. CORE-Prinzipien

Diese Prinzipien haben eine belastbare fachliche Basis, sind aber noch keine profitable Strategiebehauptung:

- **CORE — Datenintegrität:** Analyse darf nicht granularer klingen als der Feed tatsächlich ist.
- **CORE — Auction-Kontext:** Zuerst Balance/Imbalance, Value-Lage, Value-Migration, Akzeptanz oder Ablehnung bestimmen.
- **CORE — Ausgeführt versus ruhend:** Footprint/Tape zeigen ausgeführte Trades; DOM zeigt sichtbare, veränderliche Limit-Liquidität. Beides ist nicht austauschbar.
- **CORE — Aggression plus Ergebnis:** Aggressive Ausführung zählt nur zusammen mit Preisfortschritt oder dessen Ausbleiben.
- **CORE — Passive Liquidität ist indirekt:** Absorption ist eine Hypothese aus aggressivem Volumen, fehlendem Preisfortschritt und anschließender Reaktion; hohes Volumen allein beweist sie nicht.
- **CORE — Follow-through:** Ein Trigger braucht nachfolgende Initiative oder bestätigte Akzeptanz. Ohne Follow-through kein Entry.
- **CORE — Kontext vor Signal:** Delta, Imbalance, großes Volumen, POC oder DOM-Größe sind isoliert nicht richtungsgebend.
- **CORE — No edge = no trade:** Keine erzwungene Long-/Short-Entscheidung.
- **CORE — Outcome-Blindheit:** Regeln und Entscheidung werden vor der historischen Auflösung eingefroren.

## 5. Analyse-Sequenz

1. **Feed prüfen:** Instrument, Börse, Kontrakt, Echtzeit/Delay, Volume-Typ, Bid/Ask-Klassifikation, Tick- und Depth-Verfügbarkeit.
2. **Eventrisiko prüfen:** Nur marktbezogene High-Impact-Termine; rund um Releases kann Mikrostruktur untypisch oder nicht interpretierbar sein.
3. **Auction bestimmen:** Balance oder Price Discovery; vorherige und aktuelle Value Area, POC, VAH/VAL, HVN/LVN, Value-Migration.
4. **Ort bestimmen:** Relevanter Auction-Referenzpunkt; kein alter SMC-Level.
5. **Teilnehmer lesen:** Initiative oder responsive Aktivität; Aggression, Absorption, Exhaustion, Trapped Activity.
6. **Bestätigung fordern:** Preisreaktion, Delta-/Tape-Reaktion und Follow-through müssen zur Hypothese passen.
7. **Invalidierung definieren:** Beobachtbare Auction-Bedingung, bei der die Hypothese falsch ist.
8. **Plan einfrieren:** Direction oder No Trade, Entry-Trigger, Stop, Targets, Zeit-Exit, Datenstufe und Gegenevidenz.

## 6. Entry- und Risikorahmen

- Entry nur nach einem exakt definierten Setup aus der Setup-Bibliothek und ausreichender Datenstufe.
- Stop liegt jenseits der orderflow-basierten Invalidierung plus marktgerechtem Puffer; nicht willkürlich nach gewünschtem R.
- Targets liegen an Auction-Zielen wie POC, gegenüberliegendem Value-Rand, HVN/LVN-Übergang oder bestätigter Price-Discovery-Fortsetzung.
- Positionsgröße ist im Research nur in R zu modellieren. Keine echte Ordergröße.
- Vorab zu definieren: maximale Haltedauer, News-Exit, Teilgewinnlogik und Verhalten bei fehlendem Follow-through.
- Slippage, Gebühren, Spread, Kontraktroll und Feed-Delay gehören in jeden Backtest.

## 7. Research-Status von Regeln

- **CORE:** fachlich robuste Grundlage, nicht gleichbedeutend mit profitabler Entry-Regel.
- **CANDIDATE:** testbare Hypothese.
- **OPTIONAL:** nur in klar dokumentierten Regimes.
- **REJECTED:** kein belegbarer Mehrwert oder untestbar.
- **NEEDS MORE DATA:** benötigte Daten fehlen.

Alle konkreten Setups starten als `CANDIDATE` oder `NEEDS MORE DATA`. Eine Hochstufung erfordert reproduzierbaren In-Sample-Test, Walk-Forward, echtes OOS, Kostenmodell und Stabilitätsprüfung über Märkte/Regimes.

## 8. Aktuell abgelehnte Regeln

- `Delta > 0 => Long` oder `Delta < 0 => Short` — REJECTED.
- `Großes Volumen => Reversal` — REJECTED.
- Einzelne große DOM-Wand als sicherer Support/Resistance — REJECTED; Pulling/Spoofing-Risiko.
- Jede Preis-/Delta-Divergenz automatisch handeln — REJECTED.
- Community-Footprint auf CFD als echtes Exchange-Bid/Ask behandeln — REJECTED.
- Alte ICT-/SMC-Komponente mit Orderflow kombinieren — REJECTED und strategiewidrig.

## 9. ACTIVE STRATEGY CHECK

Vor jeder künftigen Analyse:

- ausschließlich Orderflow-/Auction-Begründung?
- benötigte Daten wirklich vorhanden?
- keine archivierte Logik eingeschlichen?
- Gegenevidenz und No-Trade-Option berücksichtigt?

Bei einem Nein wird die Analyse verworfen und neu aufgebaut.

## 10. Sicherheitsgrenze

Dieses Regelwerk ist Ausbildung und Research, keine Finanzberatung oder Kauf-/Verkaufsempfehlung. Es führt keine Trades oder Orders aus, erstellt keine Alerts und veröffentlicht keine Skripte.
