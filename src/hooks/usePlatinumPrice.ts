// Strategy: React Query with staleTime + cache-first strategy
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {MetalPrice} from '../types';
import {platinumService} from '../services/platinumService';
import {QUERY_CONFIG} from '../constants';

export const PLATINUM_QUERY_KEY = ['metal', 'platinum'] as const;

export const usePlatinumPrice = () => {
  const queryClient = useQueryClient();

  const query = useQuery<MetalPrice, Error>({
    queryKey: PLATINUM_QUERY_KEY,
    queryFn: ({signal}) => platinumService.getPrice(signal),
    staleTime: QUERY_CONFIG.platinum.staleTime,   // cache-first: 5 min
    gcTime: QUERY_CONFIG.platinum.gcTime,
    refetchInterval: false,
    retry: QUERY_CONFIG.platinum.retry,
    retryDelay: 2000,
  });

  const refresh = () => {
    platinumService.invalidateCache();
    queryClient.invalidateQueries({queryKey: PLATINUM_QUERY_KEY});
  };

  const isFromCache = query.dataUpdatedAt > 0 && !query.isFetching;

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isRefetching: query.isRefetching,
    isFetching: query.isFetching,
    isFromCache,
    lastUpdated: query.dataUpdatedAt,
    refresh,
    status: query.status,
  };
};
