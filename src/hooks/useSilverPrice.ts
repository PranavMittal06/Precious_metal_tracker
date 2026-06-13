// Strategy: Axios + Custom Hook with manual retry mechanism
import {useState, useCallback, useRef, useEffect} from 'react';
import {MetalPrice} from '../types';
import {silverService} from '../services/silverService';

const MAX_RETRIES = 3;

export const useSilverPrice = () => {
  const [data, setData] = useState<MetalPrice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setIsError(false);
    setError(null);

    try {
      const result = await silverService.getPrice(abortRef.current.signal);
      setData(result);
      setLastUpdated(Date.now());
      setRetryCount(0);
    } catch (err: any) {
      if (err?.name !== 'AbortError' && err?.code !== 'ERR_CANCELED') {
        setIsError(true);
        setError(err instanceof Error ? err : new Error('Failed to load Silver price'));
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const retry = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(c => c + 1);
      fetchData(false);
    }
  }, [retryCount, fetchData]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData(false);
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchData]);

  return {data, isLoading, isRefreshing, isError, error, retryCount, lastUpdated, retry, refresh};
};
