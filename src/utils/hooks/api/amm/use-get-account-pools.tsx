import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { LiquidityPool } from '@/pages/AMM/Pools/types';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import useAccountId from '../../use-account-id';
import { useGetLiquidityPools } from './use-get-liquidity-pools';

type AccountLiquidityPool = LiquidityPool & { amount: MonetaryAmount<CurrencyExt> };

const getAccountLiqudityPools = async (liquidityPools: LiquidityPool[]): Promise<Array<AccountLiquidityPool>> => {
  const accountLiquidityPools = [newMonetaryAmount(2000, GOVERNANCE_TOKEN)];

  return accountLiquidityPools.map((accountLiquidityPool) => {
    const matchingLiquidityPool = liquidityPools.find(
      (liquidityPool) => liquidityPool.lpToken === accountLiquidityPool.currency
    ) as LiquidityPool;

    return {
      ...matchingLiquidityPool,
      amount: accountLiquidityPool
    };
  }) as any;
};

interface UseGetAccountPools {
  data: Array<AccountLiquidityPool> | undefined;
  refetch: () => void;
}

const useGetAccountPools = (): UseGetAccountPools => {
  const accountId = useAccountId();

  const { data: liquidityPools } = useGetLiquidityPools();
  const queryKey = ['account-pools', accountId];
  const { data, error, refetch: refetchQuery } = useQuery({
    queryKey: ['account-pools', accountId],
    queryFn: () => liquidityPools && getAccountLiqudityPools(liquidityPools),
    enabled: !!liquidityPools,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  const refetch = () => refetchQuery({ queryKey });

  return { data, refetch };
};

export { useGetAccountPools };
export type { AccountLiquidityPool, UseGetAccountPools };
