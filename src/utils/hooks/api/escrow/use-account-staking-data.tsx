import { LiquidityPool } from '@interlay/interbtc-api';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';
import useAccountId from '../../use-account-id';


[GENERIC_FETCHER, 'escrow', 'getStakedBalance', selectedAccountAddress],


type GetLiquidityPoolsData = {

}

interface GetLiquidityPoolsResult {
  data: Array<LiquidityPool> | undefined;
  refetch: () => void;
}

const getLiquidityPools = async (): Promise<LiquidityPool[]> => {
    const [stakedBalanace] = await Promise.all([window.bridge.escrow.getStakedBalance()])

}

const useGetLiquidityPools = (): GetLiquidityPoolsResult => {
    const accountId = useAccountId();
    
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
