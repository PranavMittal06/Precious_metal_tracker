import {MetalPrice, MetalType} from '../types';
import {METAL_PRICE_API_KEY, CURRENCY, METAL_API_BASE_URL} from '../constants';
import {getMockMetalData} from '../utils';
import axios from 'axios';

const USE_MOCK = METAL_PRICE_API_KEY === 'YOUR_API_KEY_HERE';

interface MetalPriceApiResponse {
  success: boolean;
  base: string;
  timestamp: number;
  rates: Record<string, number>;
}

interface MockExtras {
  high?: number;
  low?: number;
  previousClose?: number;
  previousOpen?: number;
  changePercent?: number;
}

const fetchFromApi = async (
  apiSymbol: string,
  signal?: AbortSignal,
): Promise<MetalPriceApiResponse> => {
  const url = `${METAL_API_BASE_URL}/latest?api_key=${METAL_PRICE_API_KEY}&base=${CURRENCY}&currencies=${apiSymbol}`;
  const response = await axios.get<MetalPriceApiResponse>(url, {signal, timeout: 12000});
  if (!response.data.success) {
    throw new Error('API returned unsuccessful response');
  }
  return response.data;
};

const buildMetalPrice = (
  metal: MetalType,
  price: number,
  timestamp: number,
  extras?: MockExtras,
): MetalPrice => {
  const changePercent = extras?.changePercent ?? 0;
  const change = (price * changePercent) / 100;
  return {
    metal,
    price,
    currency: CURRENCY,
    high: extras?.high ?? price * 1.005,
    low: extras?.low ?? price * 0.995,
    previousClose: extras?.previousClose ?? price - change,
    previousOpen: extras?.previousOpen ?? price - change * 0.8,
    change,
    changePercent,
    timestamp,
    unit: 'troy oz',
    dataSource: USE_MOCK ? 'Demo Data' : 'MetalPriceAPI',
  };
};

const mockPrice = async (
  metal: MetalType,
  key: keyof ReturnType<typeof getMockMetalData>,
  delayMs: number,
): Promise<MetalPrice> => {
  await new Promise<void>(r => setTimeout(r, delayMs));
  const m = getMockMetalData()[key];
  return buildMetalPrice(metal, m.price, Math.floor(Date.now() / 1000), {
    high: m.high,
    low: m.low,
    previousClose: m.previousClose,
    previousOpen: m.previousOpen,
    changePercent: m.changePercent,
  });
};

const livePrice = async (
  metal: MetalType,
  apiSymbol: string,
  signal?: AbortSignal,
): Promise<MetalPrice> => {
  const data = await fetchFromApi(apiSymbol, signal);
  const rawRate = data.rates[apiSymbol];
  if (rawRate == null) {throw new Error(`No rate returned for ${apiSymbol}`);}
  return buildMetalPrice(metal, 1 / rawRate, data.timestamp);
};

export const fetchGoldPrice = (signal?: AbortSignal): Promise<MetalPrice> =>
  USE_MOCK ? mockPrice('gold', 'gold', 800) : livePrice('gold', 'XAU', signal);

export const fetchSilverPrice = (signal?: AbortSignal): Promise<MetalPrice> =>
  USE_MOCK ? mockPrice('silver', 'silver', 600) : livePrice('silver', 'XAG', signal);

export const fetchPlatinumPrice = (signal?: AbortSignal): Promise<MetalPrice> =>
  USE_MOCK ? mockPrice('platinum', 'platinum', 1000) : livePrice('platinum', 'XPT', signal);

export const fetchPalladiumPrice = (signal?: AbortSignal): Promise<MetalPrice> =>
  USE_MOCK ? mockPrice('palladium', 'palladium', 700) : livePrice('palladium', 'XPD', signal);
