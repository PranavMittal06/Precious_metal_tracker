import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {METAL_API_BASE_URL, METAL_PRICE_API_KEY, REQUEST_TIMEOUT_MS} from '../constants';

const createApiClient = (baseURL: string, timeout: number = REQUEST_TIMEOUT_MS): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  instance.interceptors.request.use(
    config => config,
    error => Promise.reject(error),
  );

  instance.interceptors.response.use(
    response => response,
    error => {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please check your connection and try again.');
        }
        if (!error.response) {
          throw new Error('Network error. Please check your internet connection.');
        }
        const status = error.response.status;
        if (status === 401) throw new Error('Invalid API key. Please check your configuration.');
        if (status === 429) throw new Error('Rate limit exceeded. Please try again later.');
        if (status >= 500) throw new Error('Server error. Please try again later.');
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export const metalPriceApiClient = createApiClient(METAL_API_BASE_URL);

export const fetchWithTimeout = async <T>(
  config: AxiosRequestConfig,
  signal?: AbortSignal,
): Promise<T> => {
  const response = await metalPriceApiClient.request<T>({...config, signal});
  return response.data;
};

export const buildMetalPriceUrl = (base: string, currencies: string): string =>
  `/latest?api_key=${METAL_PRICE_API_KEY}&base=${base}&currencies=${currencies}`;

export default metalPriceApiClient;
