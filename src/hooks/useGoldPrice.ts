// Strategy: React Query standard query with auto-refetch every 60 seconds
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {MetalPrice} from '../types';
import {goldService} from '../services/goldService';
import {QUERY_CONFIG} from '../constants';

export const GOLD_QUERY_KEY = ['metal', 'gold'] as const;

export const useGoldPrice = () => {
  const queryClient = useQueryClient();

  const query = useQuery<MetalPrice, Error>({
    queryKey: GOLD_QUERY_KEY,
    queryFn: () => goldService.getPrice(),
    staleTime: QUERY_CONFIG.gold.staleTime,
    gcTime: QUERY_CONFIG.gold.gcTime,
    refetchInterval: QUERY_CONFIG.gold.refetchInterval,
    refetchIntervalInBackground: true,
    retry: QUERY_CONFIG.gold.retry,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000),
  });

  const refresh = () => {
    queryClient.invalidateQueries({queryKey: GOLD_QUERY_KEY});
  };

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isRefetching: query.isRefetching,
    isFetching: query.isFetching,
    lastUpdated: query.dataUpdatedAt,
    refresh,
    status: query.status,
  };
};
