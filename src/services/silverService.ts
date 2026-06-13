import {MetalPrice} from '../types';
import {fetchSilverPrice} from './metalsApi';

class SilverService {
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 1000;

  async getPrice(signal?: AbortSignal): Promise<MetalPrice> {
    this.retryCount = 0;
    return this.fetchWithRetry(signal);
  }

  private async fetchWithRetry(signal?: AbortSignal): Promise<MetalPrice> {
    try {
      return await fetchSilverPrice(signal);
    } catch (error) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        await new Promise(r => setTimeout(r, this.retryDelay * this.retryCount));
        return this.fetchWithRetry(signal);
      }
      throw error;
    }
  }
}

export const silverService = new SilverService();
