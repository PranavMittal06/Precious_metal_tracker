/**
 * WebSocketService — real-time precious metal prices via Finnhub WebSocket API.
 *
 * Architecture:
 *   - Singleton that manages one WebSocket connection shared by all metals.
 *   - Subscribers register per symbol; service fans out incoming trade messages.
 *   - Auto-reconnects with exponential backoff; tracks connection state.
 *   - Falls back to a built-in mock simulator when no Finnhub key is set.
 */

import {
  FINNHUB_API_KEY,
  FINNHUB_WS_URL,
  FINNHUB_SYMBOLS,
  WS_RECONNECT_BASE_DELAY_MS,
  WS_RECONNECT_MAX_DELAY_MS,
  WS_PING_INTERVAL_MS,
  WS_MOCK_INTERVAL_MS,
} from '../constants';
import {MetalType} from '../types';
import {getMockMetalData} from '../utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LivePriceUpdate {
  metalType: MetalType;
  price: number;
  previousPrice: number;
  timestamp: number; // seconds
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'mock';

type PriceSubscriber = (update: LivePriceUpdate) => void;
type StatusSubscriber = (status: ConnectionStatus) => void;

interface FinnhubTradeMessage {
  type: 'trade';
  data: Array<{p: number; s: string; t: number; v: number}>;
}

interface FinnhubPingMessage {type: 'ping';}
interface FinnhubErrorMessage {type: 'error'; msg: string;}

type FinnhubMessage = FinnhubTradeMessage | FinnhubPingMessage | FinnhubErrorMessage;

const USE_MOCK = FINNHUB_API_KEY === 'YOUR_FINNHUB_KEY_HERE';

// Reverse lookup: Finnhub symbol → MetalType
const SYMBOL_TO_METAL = Object.fromEntries(
  (Object.entries(FINNHUB_SYMBOLS) as [MetalType, string][]).map(
    ([metal, sym]) => [sym, metal],
  ),
) as Record<string, MetalType>;

// ─── Service class ────────────────────────────────────────────────────────────

class WebSocketService {
  private ws: WebSocket | null = null;
  private status: ConnectionStatus = 'disconnected';
  private reconnectDelay = WS_RECONNECT_BASE_DELAY_MS;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private mockTimer: ReturnType<typeof setInterval> | null = null;
  private intentionallyClosed = false;
  private subscribedSymbols = new Set<string>();

  // Current known prices for each symbol (used to compute change direction)
  private lastPrices: Partial<Record<string, number>> = {};

  // Subscriber registries
  private priceSubscribers = new Map<string, Set<PriceSubscriber>>();
  private statusSubscribers = new Set<StatusSubscriber>();

  // ── Connection lifecycle ──────────────────────────────────────────────────

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    if (USE_MOCK) {
      this.startMockSimulator();
      return;
    }
    this.intentionallyClosed = false;
    this.setStatus('connecting');
    this.openConnection();
  }

  disconnect(): void {
    this.intentionallyClosed = true;
    this.clearTimers();
    this.ws?.close();
    this.ws = null;
    this.setStatus('disconnected');
  }

  private openConnection(): void {
    try {
      this.ws = new WebSocket(FINNHUB_WS_URL);
      this.ws.onopen    = this.onOpen;
      this.ws.onmessage = this.onMessage;
      this.ws.onerror   = this.onError;
      this.ws.onclose   = this.onClose;
    } catch {
      this.scheduleReconnect();
    }
  }

  private onOpen = (): void => {
    this.setStatus('connected');
    this.reconnectDelay = WS_RECONNECT_BASE_DELAY_MS;

    // Re-subscribe all registered symbols
    this.subscribedSymbols.forEach(sym => this.sendSubscribe(sym));

    // Start ping to keep connection alive
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({type: 'ping'}));
      }
    }, WS_PING_INTERVAL_MS);
  };

  private onMessage = (event: MessageEvent): void => {
    try {
      const msg = JSON.parse(event.data as string) as FinnhubMessage;
      if (msg.type === 'trade') {
        msg.data.forEach(trade => {
          const metalType = SYMBOL_TO_METAL[trade.s];
          if (!metalType) return;
          const previousPrice = this.lastPrices[trade.s] ?? trade.p;
          this.lastPrices[trade.s] = trade.p;
          const update: LivePriceUpdate = {
            metalType,
            price: trade.p,
            previousPrice,
            timestamp: Math.floor(trade.t / 1000),
          };
          this.notifySubscribers(trade.s, update);
        });
      }
    } catch {}
  };

  private onError = (): void => {
    // onClose will fire after onError — let it handle reconnect
  };

  private onClose = (): void => {
    this.clearTimers();
    if (!this.intentionallyClosed) {
      this.scheduleReconnect();
    }
  };

  private scheduleReconnect(): void {
    this.setStatus('reconnecting');
    this.reconnectTimer = setTimeout(() => {
      this.reconnectDelay = Math.min(
        this.reconnectDelay * 2,
        WS_RECONNECT_MAX_DELAY_MS,
      );
      this.openConnection();
    }, this.reconnectDelay);
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {clearTimeout(this.reconnectTimer); this.reconnectTimer = null;}
    if (this.pingTimer)      {clearInterval(this.pingTimer);     this.pingTimer = null;}
    if (this.mockTimer)      {clearInterval(this.mockTimer);     this.mockTimer = null;}
  }

  // ── Symbol subscription ───────────────────────────────────────────────────

  private sendSubscribe(symbol: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({type: 'subscribe', symbol}));
    }
  }

  private sendUnsubscribe(symbol: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({type: 'unsubscribe', symbol}));
    }
  }

  // ── Mock simulator ────────────────────────────────────────────────────────

  private startMockSimulator(): void {
    this.setStatus('mock');
    const base = getMockMetalData();

    // Seed last prices
    this.lastPrices['OANDA:XAU_USD'] = base.gold.price;
    this.lastPrices['OANDA:XAG_USD'] = base.silver.price;
    this.lastPrices['OANDA:XPT_USD'] = base.platinum.price;
    this.lastPrices['OANDA:XPD_USD'] = base.palladium.price;

    this.mockTimer = setInterval(() => {
      (Object.entries(FINNHUB_SYMBOLS) as [MetalType, string][]).forEach(
        ([metalType, symbol]) => {
          if (!this.priceSubscribers.has(symbol)) return;
          const prev = this.lastPrices[symbol] ?? 1000;
          // Simulate realistic micro-fluctuation: ±0.15%
          const pct = (Math.random() - 0.5) * 0.003;
          const next = parseFloat((prev * (1 + pct)).toFixed(2));
          this.lastPrices[symbol] = next;

          const update: LivePriceUpdate = {
            metalType,
            price: next,
            previousPrice: prev,
            timestamp: Math.floor(Date.now() / 1000),
          };
          this.notifySubscribers(symbol, update);
        },
      );
    }, WS_MOCK_INTERVAL_MS);
  }

  // ── Public subscription API ───────────────────────────────────────────────

  /**
   * Subscribe to live price updates for a specific metal.
   * Returns an unsubscribe function.
   */
  subscribeToMetal(metalType: MetalType, callback: PriceSubscriber): () => void {
    const symbol = FINNHUB_SYMBOLS[metalType];

    if (!this.priceSubscribers.has(symbol)) {
      this.priceSubscribers.set(symbol, new Set());
    }
    this.priceSubscribers.get(symbol)!.add(callback);

    if (!this.subscribedSymbols.has(symbol)) {
      this.subscribedSymbols.add(symbol);
      this.sendSubscribe(symbol);
    }

    return () => {
      const set = this.priceSubscribers.get(symbol);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          this.priceSubscribers.delete(symbol);
          this.subscribedSymbols.delete(symbol);
          this.sendUnsubscribe(symbol);
        }
      }
    };
  }

  /** Subscribe to connection status changes. Returns unsubscribe function. */
  subscribeToStatus(callback: StatusSubscriber): () => void {
    this.statusSubscribers.add(callback);
    // Immediately notify with current status
    callback(this.status);
    return () => {this.statusSubscribers.delete(callback);};
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  // ── Internals ─────────────────────────────────────────────────────────────

  private setStatus(s: ConnectionStatus): void {
    this.status = s;
    this.statusSubscribers.forEach(cb => cb(s));
  }

  private notifySubscribers(symbol: string, update: LivePriceUpdate): void {
    this.priceSubscribers.get(symbol)?.forEach(cb => cb(update));
  }
}

// Export singleton
export const metalWebSocket = new WebSocketService();
