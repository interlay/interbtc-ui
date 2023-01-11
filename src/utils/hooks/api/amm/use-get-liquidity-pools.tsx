import { newMonetaryAmount } from '@interlay/interbtc-api';
import { LiquidityPool } from '@interlay/interbtc-api/build/src/parachain/amm/liquidity-pool/types';
import { PoolType } from '@interlay/interbtc-api/build/src/parachain/amm/types';
import Big from 'big.js';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, useQueryClient } from 'react-query';

import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

interface UseGetLiquidityPools {
  data: Array<LiquidityPool> | undefined;
  refetch: () => void;
}

// window.bridge.AMM.getLiquidityPools()
const getLiquidityPools = async (): Promise<LiquidityPool[]> => [
  {
    apr: '21',
    lpToken: GOVERNANCE_TOKEN,
    pooledCurrencies: [
      newMonetaryAmount(new Big(10), RELAY_CHAIN_NATIVE_TOKEN),
      newMonetaryAmount(new Big(10), GOVERNANCE_TOKEN)
    ],
    poolId: 1,
    reserve0: newMonetaryAmount(new Big(10), GOVERNANCE_TOKEN),
    reserve1: newMonetaryAmount(new Big(10), GOVERNANCE_TOKEN),
    token0: newMonetaryAmount(new Big(10), GOVERNANCE_TOKEN),
    token1: newMonetaryAmount(new Big(10), GOVERNANCE_TOKEN),
    type: PoolType.STABLE
  } as any,
  {
    apr: '21',
    lpToken: WRAPPED_TOKEN,
    pooledCurrencies: [newMonetaryAmount(new Big(10), WRAPPED_TOKEN), newMonetaryAmount(new Big(10), GOVERNANCE_TOKEN)],
    poolId: 2,
    reserve0: newMonetaryAmount(new Big(10), GOVERNANCE_TOKEN),
    reserve1: newMonetaryAmount(new Big(10), GOVERNANCE_TOKEN),
    token0: newMonetaryAmount(new Big(10), GOVERNANCE_TOKEN),
    token1: newMonetaryAmount(new Big(10), GOVERNANCE_TOKEN),
    type: PoolType.STANDARD
  }
];

const useGetLiquidityPools = (): UseGetLiquidityPools => {
  const queryKey = ['liquidity-pools'];

  const { data, error } = useQuery({
    queryKey,
    queryFn: getLiquidityPools,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  const queryClient = useQueryClient();

  const refetch = () => queryClient.invalidateQueries(queryKey);

  return { data, refetch };
};

export { useGetLiquidityPools };
export type { UseGetLiquidityPools };
