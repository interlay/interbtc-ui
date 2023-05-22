import { LiquidityPool, StableLiquidityPool } from '@interlay/interbtc-api';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

interface UseGetLiquidityPools {
  data: Array<LiquidityPool> | undefined;
  refetch: () => void;
  getStableLiquidityPoolById: (poolId: number) => StableLiquidityPool;
}

const getLiquidityPools = async (): Promise<LiquidityPool[]> => window.bridge.amm.getLiquidityPools();

const useGetLiquidityPools = (): UseGetLiquidityPools => {
  const queryKey = ['liquidity-pools'];

  const { data, error, refetch } = useQuery({
    queryKey,
    queryFn: getLiquidityPools,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  const getStableLiquidityPoolById = useCallback(
    (poolId: number) => data?.find((pool) => (pool as StableLiquidityPool)?.poolId === poolId) as StableLiquidityPool,
    [data]
  );

  return { data, refetch, getStableLiquidityPoolById };
};

export { useGetLiquidityPools };
export type { UseGetLiquidityPools };
