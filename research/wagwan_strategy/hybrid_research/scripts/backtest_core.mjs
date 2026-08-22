import { gunzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';

export const ROOT = new URL('../', import.meta.url);
export const OOS_START = Date.parse('2025-05-01T00:00:00Z');
export const TEST_END = Date.parse('2025-08-01T00:00:00Z');
export const IS_END = Date.parse('2025-02-01T00:00:00Z');
export const WF_END = OOS_START;

export const MARKET_META = {
  XAUUSD: { file: 'XAUUSD_2024-08-01_2025-08-01_1m_bid_ask.json.gz', slipBps: 0.5, commissionBpsPerSide: 0.2, currencies: ['USD'] },
  BTCUSD: { file: 'BTCUSD_2024-08-01_2025-08-01_1m_bid_ask.json.gz', slipBps: 5.0, commissionBpsPerSide: 2.0, currencies: ['USD'] },
  NASDAQ: { file: 'NASDAQ_2024-08-01_2025-08-01_1m_bid_ask.json.gz', slipBps: 0.5, commissionBpsPerSide: 0.2, currencies: ['USD'], proxy: 'USATECHIDXUSD CFD' },
  SP500: { file: 'SP500_2024-08-01_2025-08-01_1m_bid_ask.json.gz', slipBps: 0.5, commissionBpsPerSide: 0.2, currencies: ['USD'], proxy: 'USA500IDXUSD CFD' },
  EURUSD: { file: 'EURUSD_2024-08-01_2025-08-01_1m_bid_ask.json.gz', slipBps: 0.1, commissionBpsPerSide: 0.05, currencies: ['USD', 'EUR'] },
};

export const BASE = Object.freeze({
  id: 'BASE_HYBRID_PREREG_1_0', fvgRequired: true, entryMode: 'retest', poiRequired: false,
  externalOnly: false, biasRequired: true, allowCountertrend: false, fourHBias: false,
  newsWindowMin: 60, fullEventDay: false, targetSpaceRequired: true, vReaction: false,
  sweepAtr: 0.03, maxSweepAtr: 1.5, displacementAtr: 0.5, zoneDisplacementAtr: 0.8,
  stopBufferAtr: 0.15, minStopAtr: 0.25, maxStopAtr: 5.0, maxEntriesPerSession: 2,
});

export const VARIANTS = [
  { ...BASE, id: 'MRWAGWAN_V3_REFERENCE_PROXY', sweepAtr: 0.08, entryMode: 'market', externalOnly: true, fullEventDay: true, targetSpaceRequired: false, diagnosticOnly: true },
  BASE,
  { ...BASE, id: 'ABL_NO_FVG', fvgRequired: false },
  { ...BASE, id: 'ABL_MARKET_ENTRY', entryMode: 'market' },
  { ...BASE, id: 'ABL_POI_REQUIRED', poiRequired: true },
  { ...BASE, id: 'ABL_EXTERNAL_ONLY', externalOnly: true },
  { ...BASE, id: 'ABL_NO_H1_BIAS', biasRequired: false },
  { ...BASE, id: 'ABL_COUNTERTREND', allowCountertrend: true },
  { ...BASE, id: 'ABL_H4_BIAS', fourHBias: true },
  { ...BASE, id: 'ABL_NEWS_NONE', newsWindowMin: 0 },
  { ...BASE, id: 'ABL_NEWS_30', newsWindowMin: 30 },
  { ...BASE, id: 'ABL_NEWS_120', newsWindowMin: 120 },
  { ...BASE, id: 'ABL_NEWS_DAY', fullEventDay: true },
  { ...BASE, id: 'ABL_NO_TARGET_SPACE', targetSpaceRequired: false },
  { ...BASE, id: 'ABL_V_REACTION', vReaction: true },
  { ...BASE, id: 'SENS_SWEEP_002', sweepAtr: 0.02, diagnosticOnly: true },
  { ...BASE, id: 'SENS_SWEEP_004', sweepAtr: 0.04, diagnosticOnly: true },
  { ...BASE, id: 'SENS_DISPLACEMENT_040', displacementAtr: 0.40, diagnosticOnly: true },
  { ...BASE, id: 'SENS_DISPLACEMENT_060', displacementAtr: 0.60, diagnosticOnly: true },
  { ...BASE, id: 'SENS_STOP_BUFFER_010', stopBufferAtr: 0.10, diagnosticOnly: true },
  { ...BASE, id: 'SENS_STOP_BUFFER_020', stopBufferAtr: 0.20, diagnosticOnly: true },
];

const berlinFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

function localParts(timestampMs) {
  const values = Object.fromEntries(berlinFormatter.formatToParts(timestampMs).map((x) => [x.type, x.value]));
  const date = `${values.year}-${values.month}-${values.day}`;
  return { date, minute: Number(values.hour) * 60 + Number(values.minute) };
}

function sessionInfo(timestampMs) {
  const p = localParts(timestampMs);
  let name = null;
  if (p.minute >= 120 && p.minute < 540) name = 'Asia';
  else if (p.minute >= 540 && p.minute < 930) name = 'London';
  else if (p.minute >= 930 && p.minute < 1320) name = 'NewYork';
  return { ...p, name, key: name ? `${p.date}|${name}` : null };
}

function midBar(raw) {
  return {
    time: raw[0],
    bidOpen: raw[1], bidHigh: raw[2], bidLow: raw[3], bidClose: raw[4],
    askOpen: raw[5], askHigh: raw[6], askLow: raw[7], askClose: raw[8],
    open: (raw[1] + raw[5]) / 2, high: (raw[2] + raw[6]) / 2,
    low: (raw[3] + raw[7]) / 2, close: (raw[4] + raw[8]) / 2,
    bidVolume: raw[9], askVolume: raw[10],
  };
}

function aggregate(bars, minutes) {
  const span = minutes * 60_000;
  const out = [];
  let current = null;
  for (let i = 0; i < bars.length; i += 1) {
    const b = bars[i];
    const time = Math.floor(b.time / span) * span;
    if (!current || current.time !== time) {
      current = { ...b, time, end: time + span, first1m: i, last1m: i };
      out.push(current);
    } else {
      for (const side of ['bid', 'ask']) {
        current[`${side}High`] = Math.max(current[`${side}High`], b[`${side}High`]);
        current[`${side}Low`] = Math.min(current[`${side}Low`], b[`${side}Low`]);
        current[`${side}Close`] = b[`${side}Close`];
      }
      current.high = Math.max(current.high, b.high);
      current.low = Math.min(current.low, b.low);
      current.close = b.close;
      current.last1m = i;
      current.bidVolume = (current.bidVolume ?? 0) + (b.bidVolume ?? 0);
      current.askVolume = (current.askVolume ?? 0) + (b.askVolume ?? 0);
    }
  }
  return out;
}

function ema(bars, length) {
  const out = Array(bars.length).fill(null);
  const k = 2 / (length + 1);
  let value = bars[0]?.close ?? 0;
  for (let i = 0; i < bars.length; i += 1) {
    value = i === 0 ? bars[i].close : bars[i].close * k + value * (1 - k);
    out[i] = value;
  }
  return out;
}

function atr(bars, length = 14) {
  const out = Array(bars.length).fill(null);
  let value = 0;
  for (let i = 0; i < bars.length; i += 1) {
    const tr = i === 0 ? bars[i].high - bars[i].low : Math.max(
      bars[i].high - bars[i].low,
      Math.abs(bars[i].high - bars[i - 1].close),
      Math.abs(bars[i].low - bars[i - 1].close),
    );
    if (i < length) value += tr / length;
    else value = ((length - 1) * value + tr) / length;
    if (i >= length - 1) out[i] = value;
  }
  return out;
}

function rollingMedian(values, window) {
  const out = Array(values.length).fill(null);
  for (let i = window - 1; i < values.length; i += 1) {
    const slice = values.slice(i - window + 1, i + 1).filter(Number.isFinite).sort((a, b) => a - b);
    if (slice.length) out[i] = slice[Math.floor(slice.length / 2)];
  }
  return out;
}

function annotatePivots(bars) {
  const high = Array(bars.length).fill(null);
  const low = Array(bars.length).fill(null);
  let lastHigh = null;
  let lastLow = null;
  for (let i = 0; i < bars.length; i += 1) {
    if (i >= 4) {
      const c = i - 2;
      if (bars[c].high > bars[c - 1].high && bars[c].high >= bars[c - 2].high && bars[c].high > bars[c + 1].high && bars[c].high >= bars[c + 2].high) {
        lastHigh = { price: bars[c].high, pivotTime: bars[c].time, knownAt: bars[i].end };
      }
      if (bars[c].low < bars[c - 1].low && bars[c].low <= bars[c - 2].low && bars[c].low < bars[c + 1].low && bars[c].low <= bars[c + 2].low) {
        lastLow = { price: bars[c].low, pivotTime: bars[c].time, knownAt: bars[i].end };
      }
    }
    high[i] = lastHigh;
    low[i] = lastLow;
  }
  return { high, low };
}

function lowerBound(bars, timestampMs) {
  let lo = 0; let hi = bars.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (bars[mid].time < timestampMs) lo = mid + 1; else hi = mid;
  }
  return lo;
}

function lastClosedIndex(bars, timestampMs) {
  let lo = 0; let hi = bars.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (bars[mid].end <= timestampMs) lo = mid + 1; else hi = mid;
  }
  return lo - 1;
}

function buildSessionReferences(bars15) {
  const refs = Array(bars15.length).fill(null);
  let group = null;
  let previous = null;
  const groups = new Map();
  for (let i = 0; i < bars15.length; i += 1) {
    const info = sessionInfo(bars15[i].time);
    bars15[i].session = info;
    if (!info.key) continue;
    if (!group || group.key !== info.key) {
      if (group) { previous = { ...group }; groups.set(group.key, { ...group }); }
      group = { key: info.key, name: info.name, date: info.date, high: bars15[i].high, low: bars15[i].low, first: i, last: i };
    } else {
      group.high = Math.max(group.high, bars15[i].high);
      group.low = Math.min(group.low, bars15[i].low);
      group.last = i;
    }
    refs[i] = previous;
  }
  if (group) groups.set(group.key, { ...group });
  return { refs, groups };
}

function buildZones(h1, indicators, config) {
  const zones = [];
  const piv = indicators.pivots;
  for (let i = 55; i < h1.length; i += 1) {
    const b = h1[i];
    const a = indicators.atr[i];
    if (!a) continue;
    const body = Math.abs(b.close - b.open);
    const priorHigh = piv.high[i - 1];
    const priorLow = piv.low[i - 1];
    let direction = null;
    if (body >= config.zoneDisplacementAtr * a && priorHigh && b.close > priorHigh.price && b.close > b.open) direction = 'long';
    if (body >= config.zoneDisplacementAtr * a && priorLow && b.close < priorLow.price && b.close < b.open) direction = 'short';
    if (!direction) continue;
    let origin = null;
    for (let j = i - 1; j >= Math.max(0, i - 6); j -= 1) {
      if ((direction === 'long' && h1[j].close < h1[j].open) || (direction === 'short' && h1[j].close > h1[j].open)) { origin = h1[j]; break; }
    }
    if (!origin) continue;
    const zone = direction === 'long'
      ? { direction, low: origin.low, high: origin.open, createdAt: b.end, originTime: origin.time, invalidAt: null }
      : { direction, low: origin.open, high: origin.high, createdAt: b.end, originTime: origin.time, invalidAt: null };
    for (let j = i + 1; j < h1.length; j += 1) {
      if ((direction === 'long' && h1[j].close < zone.low) || (direction === 'short' && h1[j].close > zone.high)) { zone.invalidAt = h1[j].end; break; }
    }
    zones.push(zone);
  }
  return zones;
}

function currentZone(zones, direction, timestampMs, bar) {
  const matches = zones.filter((z) => z.direction === direction && z.createdAt <= timestampMs && (!z.invalidAt || z.invalidAt > timestampMs) && bar.low <= z.high && bar.high >= z.low);
  return matches.at(-1) ?? null;
}

function h1Bias(series, i) {
  if (i < 50) return 'neutral';
  if (series.h1[i].close > series.h1ema50[i] && series.h1ema20[i] > series.h1ema50[i]) return 'long';
  if (series.h1[i].close < series.h1ema50[i] && series.h1ema20[i] < series.h1ema50[i]) return 'short';
  return 'neutral';
}

function regime(series, i) {
  const a = series.h1atr[i]; const med = series.h1atrMedian[i];
  const vol = !a || !med ? 'unknown' : a > 1.25 * med ? 'high' : a < 0.8 * med ? 'low' : 'normal';
  const sep = a ? Math.abs(series.h1ema20[i] - series.h1ema50[i]) / a : 0;
  return { volatility: vol, structure: sep >= 0.35 ? 'trending' : 'sideways', atrRatio: a && med ? a / med : null };
}

function relevantEvents(events, market, entryTime) {
  const currencies = MARKET_META[market].currencies;
  return events.filter((e) => currencies.includes(e.currency)).map((e) => ({ ...e, distanceMin: (entryTime - e.timeMs) / 60_000 }));
}

function newsDecision(events, market, entryTime, config) {
  const relevant = relevantEvents(events, market, entryTime);
  let nearest = null;
  for (const e of relevant) if (!nearest || Math.abs(e.distanceMin) < Math.abs(nearest.distanceMin)) nearest = e;
  const entryDate = localParts(entryTime).date;
  const eventDay = relevant.some((e) => localParts(e.timeMs).date === entryDate);
  const blocked = config.fullEventDay ? eventDay : config.newsWindowMin > 0 && nearest && Math.abs(nearest.distanceMin) <= config.newsWindowMin;
  return { blocked: Boolean(blocked), nearest, eventDay };
}

function sweepCandidate(bar, level, direction, atrValue, config) {
  if (!level || !atrValue) return false;
  if (direction === 'long') {
    const depth = level - bar.low;
    return depth >= config.sweepAtr * atrValue && depth <= config.maxSweepAtr * atrValue && bar.close > level;
  }
  const depth = bar.high - level;
  return depth >= config.sweepAtr * atrValue && depth <= config.maxSweepAtr * atrValue && bar.close < level;
}

function confirm5m(series, sweep, direction, level, config) {
  const bars = series.m5;
  const breachStart = Math.max(0, lowerBound(bars, sweep.time) - 1);
  let breachIndex = null;
  for (let i = breachStart; i < bars.length && bars[i].time < sweep.end; i += 1) {
    if ((direction === 'long' && bars[i].low < level) || (direction === 'short' && bars[i].high > level)) { breachIndex = i; break; }
  }
  if (breachIndex === null) return null;
  if (config.vReaction) {
    let reclaimed = false;
    for (let i = breachIndex; i <= Math.min(breachIndex + 1, bars.length - 1); i += 1) {
      if ((direction === 'long' && bars[i].close > level) || (direction === 'short' && bars[i].close < level)) reclaimed = true;
    }
    if (!reclaimed) return null;
  }
  const pivot = direction === 'long' ? series.m5pivots.high[Math.max(0, breachIndex - 1)] : series.m5pivots.low[Math.max(0, breachIndex - 1)];
  if (!pivot) return null;
  const deadline = sweep.end + 30 * 60_000;
  for (let i = breachIndex; i < bars.length && bars[i].end <= deadline; i += 1) {
    const b = bars[i]; const a = series.m5atr[i];
    if (!a || Math.abs(b.close - b.open) < config.displacementAtr * a) continue;
    const bos = direction === 'long' ? b.close > pivot.price && b.close > b.open : b.close < pivot.price && b.close < b.open;
    if (!bos) continue;
    const fvg = i >= 2 && (direction === 'long' ? b.low > bars[i - 2].high : b.high < bars[i - 2].low);
    if (config.fvgRequired && !fvg) continue;
    let fvgLow; let fvgHigh;
    if (fvg && direction === 'long') { fvgLow = bars[i - 2].high; fvgHigh = b.low; }
    else if (fvg) { fvgLow = b.high; fvgHigh = bars[i - 2].low; }
    else { fvgLow = Math.min(b.open, b.close); fvgHigh = Math.max(b.open, b.close); }
    return { index: i, time: b.time, end: b.end, pivot: pivot.price, fvg, fvgLow, fvgHigh, fvgMid: (fvgLow + fvgHigh) / 2, displacementAtr: Math.abs(b.close - b.open) / a };
  }
  return null;
}

function findEntry(series, readyTime, direction, confirmation, config) {
  const start = lowerBound(series.m1, readyTime);
  if (config.entryMode === 'market') return start < series.m1.length ? start : null;
  const deadline = readyTime + 20 * 60_000;
  for (let i = start; i < series.m1.length && series.m1[i].time < deadline; i += 1) {
    const b = series.m1[i];
    const touched = b.low <= confirmation.fvgMid && b.high >= confirmation.fvgMid;
    const closed = direction === 'long' ? b.close > b.open : b.close < b.open;
    if (touched && closed) return i + 1 < series.m1.length ? i + 1 : null;
  }
  return null;
}

function adversePrice(price, direction, isEntry, slipBps) {
  const bps = slipBps / 10_000;
  if (direction === 'long') return price * (isEntry ? 1 + bps : 1 - bps);
  return price * (isEntry ? 1 - bps : 1 + bps);
}

function simulate(series, market, entryIndex, direction, stopLevel, sessionKey, config, context) {
  const bars = series.m1; const slip = MARKET_META[market].slipBps; const commissionBps = MARKET_META[market].commissionBpsPerSide;
  const eb = bars[entryIndex];
  const rawEntry = direction === 'long' ? eb.askOpen : eb.bidOpen;
  const entry = adversePrice(rawEntry, direction, true, slip);
  const risk = direction === 'long' ? entry - stopLevel : stopLevel - entry;
  if (!(risk > 0)) return null;
  const targets = direction === 'long' ? [entry + risk, entry + 2 * risk, entry + 3 * risk] : [entry - risk, entry - 2 * risk, entry - 3 * risk];
  const weights = [0.4, 0.4, 0.2];
  const entryCommissionR = entry * (commissionBps / 10_000) / risk;
  let remaining = 1; let nextTarget = 0; let realizedR = -entryCommissionR; let commissionR = entryCommissionR; let activeStop = stopLevel;
  let mfeR = 0; let maeR = 0; const exits = [];
  let exitIndex = entryIndex; let exitReason = 'data_end';
  for (let i = entryIndex; i < bars.length; i += 1) {
    const b = bars[i];
    if (b.session.key !== sessionKey) { exitIndex = Math.max(entryIndex, i - 1); exitReason = 'session_end'; break; }
    const favorable = direction === 'long' ? b.bidHigh - entry : entry - b.askLow;
    const adverse = direction === 'long' ? b.bidLow - entry : entry - b.askHigh;
    mfeR = Math.max(mfeR, favorable / risk); maeR = Math.min(maeR, adverse / risk);
    const stopHit = direction === 'long' ? b.bidLow <= activeStop : b.askHigh >= activeStop;
    if (stopHit) {
      const fill = adversePrice(activeStop, direction, false, slip);
      const r = (direction === 'long' ? fill - entry : entry - fill) / risk;
      const exitCommissionR = remaining * fill * (commissionBps / 10_000) / risk;
      realizedR += remaining * r - exitCommissionR; commissionR += exitCommissionR;
      exits.push({ time: b.time, type: nextTarget > 0 ? 'BE_or_stop' : 'SL', weight: remaining, level: activeStop, fill, r });
      remaining = 0; exitIndex = i; exitReason = nextTarget > 0 ? 'breakeven_stop' : 'stop'; break;
    }
    while (nextTarget < 3) {
      const hit = direction === 'long' ? b.bidHigh >= targets[nextTarget] : b.askLow <= targets[nextTarget];
      if (!hit) break;
      const fill = adversePrice(targets[nextTarget], direction, false, slip);
      const r = (direction === 'long' ? fill - entry : entry - fill) / risk;
      const weight = weights[nextTarget];
      const exitCommissionR = weight * fill * (commissionBps / 10_000) / risk;
      realizedR += weight * r - exitCommissionR; commissionR += exitCommissionR; remaining -= weight;
      exits.push({ time: b.time, type: `TP${nextTarget + 1}`, weight, level: targets[nextTarget], fill, r });
      nextTarget += 1;
      if (nextTarget === 1) activeStop = entry;
    }
    if (nextTarget === 3) { remaining = 0; exitIndex = i; exitReason = 'full_tp'; break; }
    const next = bars[i + 1];
    if (!next || next.session.key !== sessionKey) { exitIndex = i; exitReason = 'session_end'; break; }
  }
  if (remaining > 1e-9) {
    const b = bars[exitIndex]; const raw = direction === 'long' ? b.bidClose : b.askClose;
    const fill = adversePrice(raw, direction, false, slip);
    const r = (direction === 'long' ? fill - entry : entry - fill) / risk;
    const exitCommissionR = remaining * fill * (commissionBps / 10_000) / risk;
    realizedR += remaining * r - exitCommissionR; commissionR += exitCommissionR;
    exits.push({ time: b.time, type: exitReason, weight: remaining, level: raw, fill, r });
  }
  const exitTime = bars[exitIndex].time;
  return {
    ...context, market, direction, entryTime: eb.time, entry, rawEntry, stop: stopLevel,
    tp1: targets[0], tp2: targets[1], tp3: targets[2], plannedRR: 3,
    exitTime, exitReason, exits, realizedR, mfeR, maeR,
    durationMinutes: Math.max(1, Math.round((exitTime - eb.time) / 60_000) + 1),
    result: realizedR > 0.05 ? 'Win' : realizedR < -0.05 ? 'Loss' : 'BreakEven',
    spreadAtEntry: eb.askOpen - eb.bidOpen, slippageBpsPerFill: slip,
    commissionBpsPerSide: commissionBps, commissionR,
    costs: { observedSpreadAtEntry: eb.askOpen - eb.bidOpen, adverseSlippageBpsPerFill: slip, commissionBpsPerSide: commissionBps, totalCommissionR: commissionR },
  };
}

export async function loadEvents() {
  const raw = JSON.parse(await readFile(new URL('../raw/high_impact_events_2024-08_2025-07.json', import.meta.url), 'utf8'));
  return raw.events.map((e) => ({ ...e, timeMs: Date.parse(e.timeUtc) })).sort((a, b) => a.timeMs - b.timeMs);
}

export async function loadMarket(market, config = BASE) {
  const compressed = await readFile(new URL(`../raw/dukascopy/${MARKET_META[market].file}`, import.meta.url));
  const payload = JSON.parse(gunzipSync(compressed));
  const m1 = payload.bars.map(midBar);
  for (const b of m1) b.session = sessionInfo(b.time);
  const m5 = aggregate(m1, 5); const m15 = aggregate(m1, 15); const h1 = aggregate(m1, 60); const h4 = aggregate(m1, 240);
  const h1atr = atr(h1); const h4atr = atr(h4);
  const series = {
    market, payloadMeta: { dukascopyInstrument: payload.dukascopyInstrument, proxyForRequestedMarket: payload.proxyForRequestedMarket, rangeUtc: payload.rangeUtc },
    m1, m5, m15, h1, h4,
    m5atr: atr(m5), m15atr: atr(m15), h1atr, h4atr,
    h1ema20: ema(h1, 20), h1ema50: ema(h1, 50), h4ema20: ema(h4, 20), h4ema50: ema(h4, 50),
    h1atrMedian: rollingMedian(h1atr, 168),
    m5pivots: annotatePivots(m5), m15pivots: annotatePivots(m15), h1pivots: annotatePivots(h1),
  };
  Object.assign(series, buildSessionReferences(m15));
  series.zones = buildZones(h1, { atr: h1atr, pivots: series.h1pivots }, config);
  return series;
}

export function backtestMarket(series, market, config, events, range = {}) {
  const start = range.start ?? series.m1[0].time;
  const end = range.end ?? TEST_END;
  const trades = []; const funnel = { sweepCandidates: 0, biasBlocked: 0, poiBlocked: 0, confirmationBlocked: 0, entryBlocked: 0, newsBlocked: 0, stopBlocked: 0, targetSpaceBlocked: 0, overlapBlocked: 0 };
  const usedLevels = new Set(); const sessionCounts = new Map(); let lastExitTime = -Infinity;
  for (let i = 60; i < series.m15.length; i += 1) {
    const bar = series.m15[i]; const sess = bar.session;
    if (bar.end < start || bar.end >= end || !sess.key) continue;
    const a = series.m15atr[i]; const prev = series.refs[i];
    const intLow = series.m15pivots.low[i - 1]; const intHigh = series.m15pivots.high[i - 1];
    const levels = [];
    if (prev) {
      levels.push({ direction: 'long', price: prev.low, liquidityClass: 'external_previous_session', id: `${prev.key}|low` });
      levels.push({ direction: 'short', price: prev.high, liquidityClass: 'external_previous_session', id: `${prev.key}|high` });
    }
    if (!config.externalOnly && intLow) levels.push({ direction: 'long', price: intLow.price, liquidityClass: 'internal_confirmed_pivot', id: `${intLow.pivotTime}|low` });
    if (!config.externalOnly && intHigh) levels.push({ direction: 'short', price: intHigh.price, liquidityClass: 'internal_confirmed_pivot', id: `${intHigh.pivotTime}|high` });
    const hits = levels.filter((x) => !usedLevels.has(`${sess.key}|${x.id}`) && sweepCandidate(bar, x.price, x.direction, a, config));
    const longs = hits.filter((x) => x.direction === 'long').sort((x, y) => (x.liquidityClass.startsWith('external') ? -1 : 1) - (y.liquidityClass.startsWith('external') ? -1 : 1));
    const shorts = hits.filter((x) => x.direction === 'short').sort((x, y) => (x.liquidityClass.startsWith('external') ? -1 : 1) - (y.liquidityClass.startsWith('external') ? -1 : 1));
    if ((!longs.length && !shorts.length) || (longs.length && shorts.length)) continue;
    const hit = longs[0] ?? shorts[0]; const direction = hit.direction;
    funnel.sweepCandidates += 1;
    const h1i = lastClosedIndex(series.h1, bar.end); if (h1i < 55) continue;
    const bias = h1Bias(series, h1i); const zone = currentZone(series.zones, direction, bar.end, bar);
    const poiQualified = Boolean(zone);
    let countertrend = false;
    if (config.biasRequired && bias !== direction) {
      const allowed = config.allowCountertrend && bias !== 'neutral' && hit.liquidityClass.startsWith('external') && poiQualified;
      if (!allowed) { funnel.biasBlocked += 1; continue; }
      countertrend = true;
    }
    if (config.fourHBias) {
      const h4i = lastClosedIndex(series.h4, bar.end);
      const h4direction = h4i >= 50 && series.h4[h4i].close > series.h4ema50[h4i] && series.h4ema20[h4i] > series.h4ema50[h4i] ? 'long'
        : h4i >= 50 && series.h4[h4i].close < series.h4ema50[h4i] && series.h4ema20[h4i] < series.h4ema50[h4i] ? 'short' : 'neutral';
      if (h4direction !== direction) { funnel.biasBlocked += 1; continue; }
    }
    if (config.poiRequired && !poiQualified) { funnel.poiBlocked += 1; continue; }
    const confirmation = confirm5m(series, bar, direction, hit.price, config);
    if (!confirmation) { funnel.confirmationBlocked += 1; continue; }
    const ready = Math.max(bar.end, confirmation.end);
    const entryIndex = findEntry(series, ready, direction, confirmation, config);
    if (entryIndex === null || series.m1[entryIndex].time >= end || series.m1[entryIndex].session.key !== sess.key) { funnel.entryBlocked += 1; continue; }
    const entryBar = series.m1[entryIndex];
    if (entryBar.time <= lastExitTime || (sessionCounts.get(sess.key) ?? 0) >= config.maxEntriesPerSession) { funnel.overlapBlocked += 1; continue; }
    const news = newsDecision(events, market, entryBar.time, config);
    if (news.blocked) { funnel.newsBlocked += 1; usedLevels.add(`${sess.key}|${hit.id}`); continue; }
    const rawEntry = direction === 'long' ? entryBar.askOpen : entryBar.bidOpen;
    const estimatedEntry = adversePrice(rawEntry, direction, true, MARKET_META[market].slipBps);
    const extreme = direction === 'long' ? Math.min(bar.low, zone?.low ?? Infinity) : Math.max(bar.high, zone?.high ?? -Infinity);
    const stop = direction === 'long' ? extreme - config.stopBufferAtr * a : extreme + config.stopBufferAtr * a;
    const risk = direction === 'long' ? estimatedEntry - stop : stop - estimatedEntry;
    if (risk < config.minStopAtr * a || risk > config.maxStopAtr * a) { funnel.stopBlocked += 1; continue; }
    const opposingPivot = direction === 'long' ? series.m15pivots.high[i - 1] : series.m15pivots.low[i - 1];
    const candidates = direction === 'long'
      ? [prev?.high, opposingPivot?.price].filter((x) => Number.isFinite(x) && x > estimatedEntry)
      : [prev?.low, opposingPivot?.price].filter((x) => Number.isFinite(x) && x < estimatedEntry);
    const nearestTarget = candidates.length ? (direction === 'long' ? Math.min(...candidates) : Math.max(...candidates)) : null;
    const targetRoomR = nearestTarget === null ? null : Math.abs(nearestTarget - estimatedEntry) / risk;
    if (config.targetSpaceRequired && (targetRoomR === null || targetRoomR < 1)) { funnel.targetSpaceBlocked += 1; continue; }
    const reg = regime(series, h1i);
    reg.risk = ['BTCUSD', 'NASDAQ', 'SP500'].includes(market) ? (bias === 'long' ? 'risk_on_proxy' : bias === 'short' ? 'risk_off_proxy' : 'neutral_proxy') : 'unclassified';
    const previousSessionMid = prev ? (prev.high + prev.low) / 2 : null;
    const entryLocal = entryBar.session;
    const split = entryBar.time < IS_END ? 'IS' : entryBar.time < OOS_START ? 'WF' : 'OOS';
    const premiumDiscount = previousSessionMid === null ? 'unknown' : estimatedEntry < previousSessionMid ? 'discount' : 'premium';
    const aPlus = hit.liquidityClass.startsWith('external') && bias === direction && poiQualified && targetRoomR >= 2
      && ((direction === 'long' && premiumDiscount === 'discount') || (direction === 'short' && premiumDiscount === 'premium')) && !news.eventDay;
    const context = {
      ruleVersion: config.id, signalTime: bar.end, sweepBarTime: bar.time, session: sess.name, sessionKey: sess.key,
      feed: `Dukascopy ${series.payloadMeta.dukascopyInstrument}${MARKET_META[market].proxy ? ` (${MARKET_META[market].proxy})` : ''}`,
      dateEuropeBerlin: entryLocal.date, researchSplit: split,
      bias1h: bias, countertrend, liquidityClass: hit.liquidityClass, liquidityLevel: hit.price,
      sweepDepthAtr: direction === 'long' ? (hit.price - bar.low) / a : (bar.high - hit.price) / a,
      poiQualified, poiZone: zone ? { low: zone.low, high: zone.high, originTime: zone.originTime, createdAt: zone.createdAt } : null,
      mss5mTime: confirmation.end, mss5mPivot: confirmation.pivot, displacementAtr: confirmation.displacementAtr,
      fvgPresent: confirmation.fvg, fvgLow: confirmation.fvgLow, fvgHigh: confirmation.fvgHigh, fvgMid: confirmation.fvgMid,
      nearestKnownOpposingLiquidity: nearestTarget, targetRoomR, newsEventDay: news.eventDay,
      nearestNews: news.nearest ? { timeUtc: news.nearest.timeUtc, type: news.nearest.type, currency: news.nearest.currency, distanceMin: news.nearest.distanceMin } : null,
      regime: reg,
      context1h: { barTime: series.h1[h1i].time, close: series.h1[h1i].close, ema20: series.h1ema20[h1i], ema50: series.h1ema50[h1i], bias, originZoneTouched: poiQualified },
      context15m: { barTime: bar.time, previousSessionHigh: prev?.high ?? null, previousSessionLow: prev?.low ?? null, sweptLevel: hit.price, liquidityClass: hit.liquidityClass, sweepReclaim: true },
      context5m: { barTime: confirmation.time, bos: true, mss: true, choch: countertrend, pivotBroken: confirmation.pivot, displacementAtr: confirmation.displacementAtr, fvg: confirmation.fvg },
      context1m: { signalReadyTime: ready, trigger: config.entryMode === 'retest' ? 'FVG midpoint touch + directional close; next bar entry' : 'next available bar after 5m confirmation' },
      bos: true, mss: true, choch: countertrend, protectedLevel: direction === 'long' ? bar.low : bar.high,
      orderBlock: zone ? { type: direction === 'long' ? 'demand_origin' : 'supply_origin', low: zone.low, high: zone.high, status: 'algorithmic_proxy' } : null,
      premiumDiscount, aPlus,
      previousSessionMid,
    };
    const trade = simulate(series, market, entryIndex, direction, stop, sess.key, config, context);
    if (!trade) continue;
    trades.push(trade); usedLevels.add(`${sess.key}|${hit.id}`);
    sessionCounts.set(sess.key, (sessionCounts.get(sess.key) ?? 0) + 1); lastExitTime = trade.exitTime;
  }
  return { market, configId: config.id, range: { start, end }, trades, funnel };
}

function maxDrawdown(trades) {
  let equity = 0; let peak = 0; let max = 0;
  for (const t of trades.slice().sort((a, b) => a.entryTime - b.entryTime)) { equity += t.realizedR; peak = Math.max(peak, equity); max = Math.max(max, peak - equity); }
  return max;
}

function wilson(wins, n) {
  if (!n) return [null, null]; const z = 1.96; const p = wins / n; const d = 1 + z * z / n;
  const c = (p + z * z / (2 * n)) / d; const m = z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n) / d;
  return [c - m, c + m];
}

export function metrics(trades) {
  const n = trades.length; const rs = trades.map((t) => t.realizedR); const wins = rs.filter((r) => r > 0.05); const losses = rs.filter((r) => r < -0.05); const be = n - wins.length - losses.length;
  const sum = rs.reduce((a, b) => a + b, 0); const avg = n ? sum / n : null; const grossProfit = wins.reduce((a, b) => a + b, 0); const grossLoss = -losses.reduce((a, b) => a + b, 0);
  const variance = n > 1 ? rs.reduce((a, r) => a + (r - avg) ** 2, 0) / (n - 1) : null;
  const sorted = rs.slice().sort((a, b) => a - b); const medianR = n ? (n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2) : null;
  const tpHits = [1, 2, 3].map((k) => trades.filter((t) => t.exits.some((e) => e.type === `TP${k}`)).length);
  let streak = 0; let maxLossStreak = 0;
  for (const t of trades.slice().sort((a, b) => a.entryTime - b.entryTime)) { streak = t.realizedR < -0.05 ? streak + 1 : 0; maxLossStreak = Math.max(maxLossStreak, streak); }
  return {
    trades: n, wins: wins.length, losses: losses.length, breakEven: be,
    winRate: n ? wins.length / n : null, winRateWilson95: wilson(wins.length, n),
    totalR: sum, expectancyR: avg, medianR, expectancy95: n > 1 ? [avg - 1.96 * Math.sqrt(variance / n), avg + 1.96 * Math.sqrt(variance / n)] : [null, null],
    grossProfitR: grossProfit, grossLossR: grossLoss, profitFactor: grossLoss > 0 ? grossProfit / grossLoss : null,
    averageWinR: wins.length ? grossProfit / wins.length : null, averageLossR: losses.length ? -grossLoss / losses.length : null,
    maxDrawdownR: maxDrawdown(trades), maxLossStreak,
    averageDurationMinutes: n ? trades.reduce((a, t) => a + t.durationMinutes, 0) / n : null,
    averageMfeR: n ? trades.reduce((a, t) => a + t.mfeR, 0) / n : null,
    averageMaeR: n ? trades.reduce((a, t) => a + t.maeR, 0) / n : null,
    tp1HitRate: n ? tpHits[0] / n : null, tp2HitRate: n ? tpHits[1] / n : null, tp3HitRate: n ? tpHits[2] / n : null,
  };
}

export function groupMetrics(trades, keyFn) {
  const groups = new Map();
  for (const t of trades) { const key = keyFn(t); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(t); }
  return Object.fromEntries([...groups.entries()].map(([k, v]) => [k, metrics(v)]));
}

export function splitTrades(trades) {
  return {
    is: trades.filter((t) => t.entryTime < IS_END),
    wf: trades.filter((t) => t.entryTime >= IS_END && t.entryTime < WF_END),
    oos: trades.filter((t) => t.entryTime >= OOS_START && t.entryTime < TEST_END),
  };
}
