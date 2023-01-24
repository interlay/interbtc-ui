import { CurrencyExt, LiquidityPool, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import useAccountId from '../../use-account-id';
import { useGetLiquidityPools } from './use-get-liquidity-pools';

type AccountLiquidityPool = { data: LiquidityPool; amount?: MonetaryAmount<CurrencyExt> };

const getAccountLiqudityPools = async (
  pools: LiquidityPool[]
): // accountId: AccountId
Promise<Array<AccountLiquidityPool>> => {
  // window.bridge.AMM.getLiquidityProvidedByAccount(accountId)
  const accountLiquidityPools: MonetaryAmount<CurrencyExt>[] = [newMonetaryAmount(2000, GOVERNANCE_TOKEN)];

  return pools.map((pool) => ({
    data: pool,
    amount: accountLiquidityPools.find((lpToken) => lpToken.currency.ticker === pool.lpToken.ticker)
  }));
};

interface UseGetAccountProvidedLiquidity {
  data: AccountLiquidityPool[] | undefined;
  refetch: () => void;
}

const useGetAccountPools = (): UseGetAccountProvidedLiquidity => {
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
export type { AccountLiquidityPool, UseGetAccountProvidedLiquidity };

// import { CurrencyExt, LiquidityPool } from '@interlay/interbtc-api';
// import { MonetaryAmount } from '@interlay/monetary-js';
// import { AccountId } from '@polkadot/types/interfaces';
// import { useErrorHandler } from 'react-error-boundary';
// import { useQuery } from 'react-query';

// import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

// import useAccountId from '../../use-account-id';
// import { useGetLiquidityPools } from './use-get-liquidity-pools';

// type AccountLiquidityPool = { data: LiquidityPool; amount?: MonetaryAmount<CurrencyExt> };

// const getAccountLiqudityPools = async (
//   accountId: AccountId,
//   pools: LiquidityPool[]
// ): Promise<Array<AccountLiquidityPool>> => {
//   const accountLiquidityPools: MonetaryAmount<CurrencyExt>[] = await window.bridge.amm.getLiquidityProvidedByAccount(
//     accountId
//   );

//   return pools.map((pool) => ({
//     data: pool,
//     amount: accountLiquidityPools.find((lpToken) => lpToken.currency.ticker === pool.lpToken.ticker)
//   }));
// };

// interface UseGetAccountProvidedLiquidity {
//   data: AccountLiquidityPool[] | undefined;
//   refetch: () => void;
// }

// const useGetAccountPools = (): UseGetAccountProvidedLiquidity => {
//   const accountId = useAccountId();

//   const { data: liquidityPools } = useGetLiquidityPools();
//   const queryKey = ['account-pools', accountId];
//   const { data, error, refetch: refetchQuery } = useQuery({
//     queryKey: ['account-pools', accountId],
//     queryFn: () => accountId && liquidityPools && getAccountLiqudityPools(accountId, liquidityPools),
//     enabled: !!liquidityPools,
//     refetchInterval: BLOCKTIME_REFETCH_INTERVAL
//   });

//   useErrorHandler(error);

//   const refetch = () => refetchQuery({ queryKey });

//   return { data, refetch };
// };

// export { useGetAccountPools };
// export type { AccountLiquidityPool, UseGetAccountProvidedLiquidity };
