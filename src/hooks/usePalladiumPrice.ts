// Strategy: Dedicated service with AbortController + request timeout handling
import {useState, useCallback, useEffect, useRef} from 'react';
import {MetalPrice} from '../types';
import {palladiumService} from '../services/palladiumService';

export const usePalladiumPrice = () => {
  const [data, setData] = useState<MetalPrice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!mountedRef.current) return;

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setIsError(false);
    setError(null);

    try {
      const result = await palladiumService.getPrice();
      if (!mountedRef.current) return;
      setData(result);
      setLastUpdated(Date.now());
    } catch (err: any) {
      if (!mountedRef.current) return;
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to load Palladium price'));
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  const retry = useCallback(() => {
    setIsError(false);
    setError(null);
    fetchData(false);
  }, [fetchData]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData(false);
    return () => {
      mountedRef.current = false;
      palladiumService.cancelPending();
    };
  }, [fetchData]);

  return {data, isLoading, isRefreshing, isError, error, lastUpdated, refresh, retry};
};
