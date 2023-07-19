import { CurrencyExt, isCurrencyEqual, LiquidityPool, LpCurrency } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';
import { calculateAccountLiquidityUSD, calculateTotalLiquidityUSD } from '@/utils/helpers/pool';
import { Prices, useGetPrices } from '@/utils/hooks/api/use-get-prices';

import useAccountId from '../../use-account-id';
import { useGetLiquidityPools } from './use-get-liquidity-pools';

type AccountLiquidityPool = { data: LiquidityPool; amount: MonetaryAmount<LpCurrency> };

interface AccountPoolsData {
  positions: AccountLiquidityPool[];
  claimableRewards: Map<LpCurrency, MonetaryAmount<CurrencyExt>[]>;
  accountLiquidityUSD: Big;
}

const getAccountLiquidityPools = async (
  accountId: AccountId,
  pools: LiquidityPool[],
  prices: Prices
): Promise<AccountPoolsData> => {
  const accountLiquidityPools = await window.bridge.amm.getLiquidityProvidedByAccount(accountId);
  const claimableRewards = await window.bridge.amm.getClaimableFarmingRewards(accountId, accountLiquidityPools, pools);
  const filteredPools = accountLiquidityPools.filter((lpToken) => !lpToken.isZero());

  const positions = filteredPools.reduce((acc: AccountLiquidityPool[], amount) => {
    const pool = pools.find((pool) => isCurrencyEqual(pool.lpToken, amount.currency));

    if (!pool) return acc;

    const data = { data: pool, amount };

    return [...acc, data];
  }, []);

  const accountLiquidityUSD = positions
    .map(({ data, amount: accountLPTokenAmount }) => {
      const { pooledCurrencies, totalSupply, isEmpty } = data;
      const totalLiquidityUSD = calculateTotalLiquidityUSD(pooledCurrencies, prices);

      return accountLPTokenAmount && !isEmpty
        ? calculateAccountLiquidityUSD(accountLPTokenAmount, totalLiquidityUSD, totalSupply)
        : 0;
    })
    .reduce((total, accountLPTokenAmount) => total.add(accountLPTokenAmount), new Big(0));

  return { positions, claimableRewards, accountLiquidityUSD };
};

interface UseGetAccountProvidedLiquidity {
  data: AccountPoolsData | undefined;
  refetch: () => void;
}

// Mixes current pools with liquidity provided by the account
const useGetAccountPools = (): UseGetAccountProvidedLiquidity => {
  const accountId = useAccountId();
  const prices = useGetPrices();

  const { data: liquidityPools, refetch: refetchLiquidityPools } = useGetLiquidityPools();
  const queryKey = ['account-pools', accountId];
  const { data, error, refetch: refetchQuery } = useQuery({
    queryKey: ['account-pools', accountId],
    queryFn: () => accountId && liquidityPools && prices && getAccountLiquidityPools(accountId, liquidityPools, prices),
    enabled: !!accountId && !!liquidityPools && !!prices,
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
