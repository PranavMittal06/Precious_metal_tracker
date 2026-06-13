/**
 * useRealTimePrice — merges WebSocket live updates into existing MetalPrice data.
 *
 * Strategy:
 *   1. Accepts baseData from the REST hooks (initial load, error, refresh).
 *   2. Subscribes to the WebSocket service for live price ticks.
 *   3. Each tick updates price + timestamp, recomputes change/changePercent
 *      against the REST baseline previousClose so the delta stays meaningful.
 *   4. Exposes a `flashDirection` so MetalCard can trigger color animations.
 */

import {useState, useEffect, useRef, useCallback} from 'react';
import {MetalPrice, MetalType} from '../types';
import {metalWebSocket, ConnectionStatus, LivePriceUpdate} from '../services/webSocketService';

export type FlashDirection = 'up' | 'down' | null;

export interface RealTimeData {
  /** Merged data: REST baseline + live price/timestamp overrides */
  data: MetalPrice | null;
  /** Direction of the latest price tick (null = no tick yet) */
  flashDirection: FlashDirection;
  /** Number of live ticks received since mount */
  tickCount: number;
  /** Timestamp of latest tick (ms) */
  lastTickMs: number | null;
  /** Current WebSocket connection status */
  wsStatus: ConnectionStatus;
}

export const useRealTimePrice = (
  metalType: MetalType,
  baseData: MetalPrice | null,
): RealTimeData => {
  const [liveData, setLiveData] = useState<MetalPrice | null>(baseData);
  const [flashDirection, setFlashDirection] = useState<FlashDirection>(null);
  const [tickCount, setTickCount] = useState(0);
  const [lastTickMs, setLastTickMs] = useState<number | null>(null);
  const [wsStatus, setWsStatus] = useState<ConnectionStatus>('connecting');

  // Flash timeout ref — clear if another tick arrives before it expires
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track the REST baseline so changePercent is computed against it
  const baselineClose = useRef<number | null>(null);

  // Sync baseData → liveData when REST hook provides a fresh value
  useEffect(() => {
    if (!baseData) return;
    setLiveData(baseData);
    // Record the first REST previousClose as our baseline for % change
    if (baselineClose.current === null && baseData.previousClose) {
      baselineClose.current = baseData.previousClose;
    }
  }, [baseData]);

  const handlePriceUpdate = useCallback(
    (update: LivePriceUpdate) => {
      setLiveData(prev => {
        if (!prev) return prev;

        const close = baselineClose.current ?? prev.previousClose ?? update.previousPrice;
        const change = update.price - (close ?? update.price);
        const changePercent = close ? (change / close) * 100 : 0;

        return {
          ...prev,
          price: update.price,
          change,
          changePercent,
          timestamp: update.timestamp,
        };
      });

      // Trigger flash animation
      const direction: FlashDirection = update.price >= update.previousPrice ? 'up' : 'down';
      setFlashDirection(direction);
      setTickCount(c => c + 1);
      setLastTickMs(Date.now());

      // Clear flash after 600 ms
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlashDirection(null), 600);
    },
    [],
  );

  // Subscribe to live price ticks
  useEffect(() => {
    const unsubPrice  = metalWebSocket.subscribeToMetal(metalType, handlePriceUpdate);
    const unsubStatus = metalWebSocket.subscribeToStatus(setWsStatus);

    return () => {
      unsubPrice();
      unsubStatus();
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, [metalType, handlePriceUpdate]);

  return {data: liveData, flashDirection, tickCount, lastTickMs, wsStatus};
};

/** Hook that tracks the shared WebSocket connection status only (no price data). */
export const useWsStatus = (): ConnectionStatus => {
  const [status, setStatus] = useState<ConnectionStatus>(metalWebSocket.getStatus());
  useEffect(() => metalWebSocket.subscribeToStatus(setStatus), []);
  return status;
};
