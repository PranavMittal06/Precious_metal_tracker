import {MetalType} from '../types';

export const METAL_API_BASE_URL = 'https://api.metalpriceapi.com/v1';
export const METALS_API_BASE_URL = 'https://metals-api.com/api';
export const GOLD_API_BASE_URL = 'https://www.goldapi.io/api';

// ⚠️  Replace with your actual API key from metalpriceapi.com (free tier available)
export const METAL_PRICE_API_KEY = 'YOUR_API_KEY_HERE';

// API symbols
export const METAL_SYMBOLS: Record<MetalType, string> = {
  gold: 'XAU',
  silver: 'XAG',
  platinum: 'XPT',
  palladium: 'XPD',
};

// Display configuration per metal
export const METAL_CONFIG: Record<MetalType, {
  name: string;
  symbol: string;
  apiSymbol: string;
  unit: string;
  displayIcon: string;
  shortName: string;
}> = {
  gold: {
    name: 'Gold',
    symbol: 'Au',
    apiSymbol: 'XAU',
    unit: 'troy oz',
    displayIcon: '🥇',
    shortName: 'XAU',
  },
  silver: {
    name: 'Silver',
    symbol: 'Ag',
    apiSymbol: 'XAG',
    unit: 'troy oz',
    displayIcon: '🥈',
    shortName: 'XAG',
  },
  platinum: {
    name: 'Platinum',
    symbol: 'Pt',
    apiSymbol: 'XPT',
    unit: 'troy oz',
    displayIcon: '💎',
    shortName: 'XPT',
  },
  palladium: {
    name: 'Palladium',
    symbol: 'Pd',
    apiSymbol: 'XPD',
    unit: 'troy oz',
    displayIcon: '⚗️',
    shortName: 'XPD',
  },
};

// React Query config per metal
export const QUERY_CONFIG = {
  gold: {
    staleTime: 55_000,         // 55 seconds (refetch every 60s)
    gcTime: 5 * 60_000,        // 5 minutes cache
    refetchInterval: 60_000,   // auto refetch every 60s
    retry: 3,
  },
  silver: {
    staleTime: 0,              // always fresh (manual control)
    gcTime: 2 * 60_000,
    refetchInterval: false,    // manual only
    retry: 0,                  // manual retry implemented in hook
  },
  platinum: {
    staleTime: 5 * 60_000,    // cache-first: 5 min stale time
    gcTime: 15 * 60_000,      // keep cache for 15 min
    refetchInterval: false,
    retry: 2,
  },
  palladium: {
    staleTime: 30_000,
    gcTime: 3 * 60_000,
    refetchInterval: false,   // AbortController managed manually
    retry: 1,
  },
};

export const REQUEST_TIMEOUT_MS = 12_000;
export const CURRENCY = 'USD';

// ─── WebSocket / Real-time config ───────────────────────────────────────────
// ⚠️  Get a free API key from https://finnhub.io  (free tier: 60 req/min)
export const FINNHUB_API_KEY = 'YOUR_FINNHUB_KEY_HERE';
export const FINNHUB_WS_URL = `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`;

// Finnhub OANDA forex symbols for precious metals
export const FINNHUB_SYMBOLS: Record<MetalType, string> = {
  gold:      'OANDA:XAU_USD',
  silver:    'OANDA:XAG_USD',
  platinum:  'OANDA:XPT_USD',
  palladium: 'OANDA:XPD_USD',
};

export const WS_RECONNECT_BASE_DELAY_MS = 1_500;
export const WS_RECONNECT_MAX_DELAY_MS  = 30_000;
export const WS_PING_INTERVAL_MS        = 25_000;
// Mock simulator update interval (used when no Finnhub key is configured)
export const WS_MOCK_INTERVAL_MS        = 2_500;
