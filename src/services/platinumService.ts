import {MetalPrice} from '../types';
import {fetchPlatinumPrice} from './metalsApi';

class PlatinumService {
  private cache: {data: MetalPrice; cachedAt: number} | null = null;
  private cacheTTLMs = 5 * 60 * 1000; // 5 min cache-first strategy

  async getPrice(signal?: AbortSignal, forceRefresh = false): Promise<MetalPrice> {
    if (!forceRefresh && this.cache) {
      const age = Date.now() - this.cache.cachedAt;
      if (age < this.cacheTTLMs) {
        return this.cache.data;
      }
    }
    const data = await fetchPlatinumPrice(signal);
    this.cache = {data, cachedAt: Date.now()};
    return data;
  }

  invalidateCache(): void {
    this.cache = null;
  }
}

export const platinumService = new PlatinumService();
