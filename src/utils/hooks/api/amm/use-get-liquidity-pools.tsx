import { LiquidityPool } from '@interlay/interbtc-api';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

interface UseGetLiquidityPools {
  data: Array<LiquidityPool> | undefined;
  refetch: () => void;
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

  return { data, refetch };
};

export { useGetLiquidityPools };
export type { UseGetLiquidityPools };
