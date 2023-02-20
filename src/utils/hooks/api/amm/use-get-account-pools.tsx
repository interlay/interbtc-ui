import { CurrencyExt, isCurrencyEqual, LiquidityPool, LpCurrency } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import useAccountId from '../../use-account-id';
import { useGetLiquidityPools } from './use-get-liquidity-pools';

type AccountLiquidityPool = { data: LiquidityPool; amount: MonetaryAmount<LpCurrency> };

interface AccountPoolsData {
  positions: AccountLiquidityPool[];
  claimableRewards: Map<LpCurrency, MonetaryAmount<CurrencyExt>[]>;
}

const getAccountLiqudityPools = async (accountId: AccountId, pools: LiquidityPool[]): Promise<AccountPoolsData> => {
  const accountLiquidityPools = await window.bridge.amm.getLiquidityProvidedByAccount(accountId);
  const claimableRewards = await window.bridge.amm.getClaimableFarmingRewards(accountId, accountLiquidityPools, pools);
  const filteredPools = accountLiquidityPools.filter((lpToken) => !lpToken.isZero());
  console.log('here');
  const positions = filteredPools.reduce((acc: AccountLiquidityPool[], amount) => {
    const pool = pools.find((pool) => isCurrencyEqual(pool.lpToken, amount.currency));

    if (!pool) return acc;

    const data = { data: pool, amount };

    return [...acc, data];
  }, []);

  return { positions, claimableRewards };
};

interface UseGetAccountProvidedLiquidity {
  data: AccountPoolsData | undefined;
  refetch: () => void;
}

// Mixes current pools with liquidity provided by the account
const useGetAccountPools = (): UseGetAccountProvidedLiquidity => {
  const accountId = useAccountId();

  const { data: liquidityPools, refetch: refetchLiquidityPools } = useGetLiquidityPools();
  const queryKey = ['account-pools', accountId];
  const { data, error, refetch: refetchQuery } = useQuery({
    queryKey: ['account-pools', accountId],
    queryFn: () => accountId && liquidityPools && getAccountLiqudityPools(accountId, liquidityPools),
    enabled: !!liquidityPools,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  const refetch = () => {
    refetchQuery({ queryKey });
    refetchLiquidityPools();
  };

  return { data, refetch };
};

export { useGetAccountPools };
export type { AccountLiquidityPool, AccountPoolsData, UseGetAccountProvidedLiquidity };
