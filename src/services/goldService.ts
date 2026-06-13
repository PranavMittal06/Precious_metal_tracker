import {MetalPrice} from '../types';
import {fetchGoldPrice} from './metalsApi';

class GoldService {
  async getPrice(signal?: AbortSignal): Promise<MetalPrice> {
    return fetchGoldPrice(signal);
  }
}

export const goldService = new GoldService();
