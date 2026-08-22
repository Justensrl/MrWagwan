import { createHash } from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';

const FROM = new Date('2024-08-01T00:00:00.000Z');
const TO = new Date('2025-08-01T00:00:00.000Z');
const OUT_DIR = new URL('../raw/dukascopy/', import.meta.url);
const DAILY_DIR = new URL('../raw/dukascopy/cache/daily/', import.meta.url);
const BASE_URL = 'https://jetta.dukascopy.com/v1';
const REQUEST_DELAY_MS = 900;
const MAX_ATTEMPTS = 20;

const instruments = [
  { market: 'XAUUSD', code: 'XAU-USD', label: 'XAU/USD', proxy: false },
  { market: 'BTCUSD', code: 'BTC-USD', label: 'BTC/USD', proxy: false },
  { market: 'NASDAQ', code: 'USATECH.IDX-USD', label: 'USATECH.IDX/USD', proxy: true },
  { market: 'SP500', code: 'USA500.IDX-USD', label: 'USA500.IDX/USD', proxy: true },
  { market: 'EURUSD', code: 'EUR-USD', label: 'EUR/USD', proxy: false },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isoDay = (date) => date.toISOString().slice(0, 10);
const dayPath = (code, side, date) => new URL(`${code.replaceAll('.', '_')}_${side}_${isoDay(date)}.json.gz`, DAILY_DIR);

function precision(multiplier) {
  if (!multiplier) return 1;
  const exponent = Math.floor(Math.log10(multiplier));
  return exponent > 0 ? multiplier : 10 ** Math.abs(exponent);
}

function deltaValue(previous, delta, multiplier, factor) {
  return Math.round((previous + delta * multiplier) * factor) / factor;
}

function decodeCandles(payload) {
  const times = payload.times ?? [];
  const opens = payload.opens ?? [];
  const highs = payload.highs ?? [];
  const lows = payload.lows ?? [];
  const closes = payload.closes ?? [];
  const volumes = payload.volumes ?? [];
  const size = times.length;
  if ([opens, highs, lows, closes, volumes].some((values) => values.length !== size)) {
    throw new Error('Dukascopy OHLCV arrays are inconsistent');
  }
  const shift = payload.shift ?? 1;
  const multiplier = payload.multiplier ?? 1;
  const factor = precision(multiplier);
  let timestamp = payload.timestamp ?? 0;
  let open = payload.open ?? 0;
  let high = payload.high ?? 0;
  let low = payload.low ?? 0;
  let close = payload.close ?? 0;
  const rows = [];
  for (let i = 0; i < size; i += 1) {
    timestamp += shift * times[i];
    open = deltaValue(open, opens[i], multiplier, factor);
    high = deltaValue(high, highs[i], multiplier, factor);
    low = deltaValue(low, lows[i], multiplier, factor);
    close = deltaValue(close, closes[i], multiplier, factor);
    rows.push({ timestamp, open, high, low, close, volume: Math.round(volumes[i] * 1_000_000) });
  }
  return rows;
}

async function fetchJson(url) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Origin: 'https://widgets.dukascopy.com',
        Referer: 'https://widgets.dukascopy.com/',
        'User-Agent': 'MrWagwanResearch/1.0 (serial public historical-data export)',
      },
    });
    if (response.ok) return response.json();
    const body = await response.text().catch(() => '');
    lastError = new Error(`HTTP ${response.status} ${response.statusText}: ${body.slice(0, 200)}`);
    if (![429, 500, 502, 503, 504].includes(response.status)) throw lastError;
    const retryAfterSeconds = Number(response.headers.get('retry-after'));
    const waitMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
      ? retryAfterSeconds * 1_000
      : Math.min(600_000, 30_000 * (2 ** Math.min(attempt - 1, 4)));
    process.stdout.write(`rate/server retry ${attempt}/${MAX_ATTEMPTS}; wait ${Math.round(waitMs / 1_000)}s\n`);
    await sleep(waitMs);
  }
  throw lastError;
}

async function loadDay(code, side, date) {
  const path = dayPath(code, side, date);
  try {
    return JSON.parse(gunzipSync(await readFile(path)));
  } catch (error) {
    if (error.code !== 'ENOENT') process.stdout.write(`invalid cache ${path.pathname}: ${error.message}\n`);
  }
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const url = `${BASE_URL}/candles/minute/${encodeURIComponent(code)}/${side}/${year}/${month}/${day}`;
  const payload = await fetchJson(url);
  const rows = decodeCandles(payload);
  await writeFile(path, gzipSync(Buffer.from(JSON.stringify(rows)), { level: 9 }));
  await sleep(REQUEST_DELAY_MS);
  return rows;
}

async function fetchSide(code, side) {
  const all = [];
  let count = 0;
  for (let cursor = new Date(FROM); cursor < TO; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const rows = await loadDay(code, side, new Date(cursor));
    all.push(...rows);
    count += 1;
    if (count % 25 === 0 || cursor.getTime() + 86_400_000 >= TO.getTime()) {
      process.stdout.write(`${code}/${side}: ${count}/365 days, ${all.length} bars\n`);
    }
  }
  all.sort((a, b) => a.timestamp - b.timestamp);
  return all;
}

function mergeBidAsk(bid, ask) {
  const bars = [];
  let i = 0;
  let j = 0;
  while (i < bid.length && j < ask.length) {
    const b = bid[i];
    const a = ask[j];
    if (b.timestamp < a.timestamp) { i += 1; continue; }
    if (a.timestamp < b.timestamp) { j += 1; continue; }
    bars.push([
      b.timestamp,
      b.open, b.high, b.low, b.close,
      a.open, a.high, a.low, a.close,
      b.volume ?? null, a.volume ?? null,
    ]);
    i += 1;
    j += 1;
  }
  return bars;
}

await mkdir(OUT_DIR, { recursive: true });
await mkdir(DAILY_DIR, { recursive: true });
const manifest = {
  generatedAt: new Date().toISOString(),
  source: 'Dukascopy Bank JETTA public historical feed used by the official Historical Data Export widget',
  sourcePage: 'https://www.dukascopy.com/swiss/english/marketwatch/historical/',
  widget: 'https://widgets.dukascopy.com/en/historical-data-export',
  endpointBase: BASE_URL,
  endpointPattern: '/candles/minute/{instrument}/{BID|ASK}/{year}/{month}/{day}',
  acquisition: { serial: true, requestDelayMs: REQUEST_DELAY_MS, resumableDailyCache: true },
  rangeUtc: { from: FROM.toISOString(), toExclusive: TO.toISOString() },
  timeframe: '1m',
  priceSides: ['BID', 'ASK'],
  schema: ['timestampMs','bidOpen','bidHigh','bidLow','bidClose','askOpen','askHigh','askLow','askClose','bidVolume','askVolume'],
  instruments: [],
};

for (const item of instruments) {
  const startedAt = Date.now();
  process.stdout.write(`Downloading ${item.market} (${item.code}) serially...\n`);
  const bid = await fetchSide(item.code, 'BID');
  const ask = await fetchSide(item.code, 'ASK');
  const bars = mergeBidAsk(bid, ask);
  if (bars.length < 100_000) throw new Error(`${item.market}: insufficient merged 1m bars (${bars.length})`);
  const payload = {
    market: item.market,
    dukascopyInstrument: item.code,
    requestedFeedLabel: item.label,
    proxyForRequestedMarket: item.proxy,
    rangeUtc: manifest.rangeUtc,
    timeframe: manifest.timeframe,
    schema: manifest.schema,
    bars,
  };
  const compressed = gzipSync(Buffer.from(JSON.stringify(payload)), { level: 9 });
  const filename = `${item.market}_2024-08-01_2025-08-01_1m_bid_ask.json.gz`;
  await writeFile(new URL(filename, OUT_DIR), compressed);
  const entry = {
    ...item,
    filename,
    bidBars: bid.length,
    askBars: ask.length,
    mergedBars: bars.length,
    firstTimestampMs: bars[0][0],
    lastTimestampMs: bars.at(-1)[0],
    compressedBytes: compressed.length,
    sha256: createHash('sha256').update(compressed).digest('hex'),
    durationMs: Date.now() - startedAt,
  };
  manifest.instruments.push(entry);
  await writeFile(new URL('manifest.partial.json', OUT_DIR), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  process.stdout.write(`${item.market}: ${bars.length} merged bars, ${(compressed.length / 1_048_576).toFixed(1)} MiB\n`);
}

await writeFile(new URL('manifest.json', OUT_DIR), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
await unlink(new URL('manifest.partial.json', OUT_DIR)).catch((error) => { if (error.code !== 'ENOENT') throw error; });
process.stdout.write('Dukascopy dataset complete.\n');
