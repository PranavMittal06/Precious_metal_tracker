import {MetalType} from '../theme/colors';

export type {MetalType};

export interface MetalPrice {
  metal: MetalType;
  price: number;
  currency: string;
  previousClose?: number;
  previousOpen?: number;
  high?: number;
  low?: number;
  change?: number;
  changePercent?: number;
  timestamp: number;
  unit?: string;
  dataSource?: string;
}

export interface MetalApiResponse {
  success: boolean;
  rates: {
    [key: string]: number;
  };
  base?: string;
  timestamp?: number;
}

export interface MetalPriceState {
  data: MetalPrice | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isRefreshing: boolean;
  lastUpdated: number | null;
}

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface MarketStat {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Details: {
    metalType: MetalType;
    metalData: MetalPrice;
  };
};

export interface MetalConfig {
  name: string;
  symbol: string;
  apiSymbol: string;
  unit: string;
  icon: string;
  color: string;
}
