import {MetalPrice} from '../types';
import {fetchPalladiumPrice} from './metalsApi';
import {REQUEST_TIMEOUT_MS} from '../constants';

class PalladiumService {
  private currentController: AbortController | null = null;

  async getPrice(): Promise<MetalPrice> {
    // Cancel any in-flight request
    this.cancelPending();

    this.currentController = new AbortController();
    const {signal} = this.currentController;

    const timeoutId = setTimeout(() => {
      this.currentController?.abort();
    }, REQUEST_TIMEOUT_MS);

    try {
      const data = await fetchPalladiumPrice(signal);
      clearTimeout(timeoutId);
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    } finally {
      this.currentController = null;
    }
  }

  cancelPending(): void {
    if (this.currentController) {
      this.currentController.abort();
      this.currentController = null;
    }
  }
}

export const palladiumService = new PalladiumService();
