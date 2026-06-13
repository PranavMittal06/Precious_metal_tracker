import {TrendDirection} from '../types';

export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatPriceCompact = (price: number): string => {
  if (price >= 1000) {
    return `$${(price / 1000).toFixed(2)}K`;
  }
  return `$${price.toFixed(2)}`;
};

export const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatChange = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}`;
};

export const getTrendDirection = (changePercent?: number): TrendDirection => {
  if (!changePercent || changePercent === 0) return 'neutral';
  return changePercent > 0 ? 'up' : 'down';
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatFullDateTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
};

export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const calculateMockChange = (price: number): {change: number; changePercent: number} => {
  const changePercent = (Math.random() - 0.5) * 2;
  const change = (price * changePercent) / 100;
  return {change, changePercent};
};

// Fallback mock data when API key is not configured
export const getMockMetalData = () => ({
  gold:      { price: 2380.45, high: 2395.10, low: 2365.80, previousClose: 2371.20, previousOpen: 2368.50, changePercent: 0.39 },
  silver:    { price: 29.85,   high: 30.12,   low: 29.55,   previousClose: 29.61,   previousOpen: 29.68,   changePercent: 0.81 },
  platinum:  { price: 986.70,  high: 995.40,  low: 980.20,  previousClose: 981.30,  previousOpen: 983.10,  changePercent: 0.55 },
  palladium: { price: 912.50,  high: 928.60,  low: 905.30,  previousClose: 908.20,  previousOpen: 910.40,  changePercent: 0.47 },
});
