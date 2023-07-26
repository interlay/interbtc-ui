import { ChainBalance, CurrencyExt } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { useGetCurrencies } from '@/hooks/api/use-get-currencies';
import useAccountId from '@/hooks/use-account-id';
import { useSubstrateSecureState } from '@/lib/substrate';
import { REFETCH_INTERVAL } from '@/utils/constants/api';

type BalanceData = {
  [ticker: string]: ChainBalance;
};

const getBalances = async (currencies: CurrencyExt[], accountId: AccountId): Promise<BalanceData> => {
  const chainBalances = await Promise.all(
    currencies.map((currency) => window.bridge.tokens.balance(currency, accountId))
  );

  return chainBalances.reduce(
    (acc, balance) => ({
      ...acc,
      [balance.currency.ticker]: balance
    }),
    {}
  );
};

type UseGetBalances = UseQueryResult<BalanceData | undefined> & {
  getBalance: (ticker: string) => ChainBalance | undefined;
  getAvailableBalance: (ticker: string) => ChainBalance['free'] | undefined;
};

const getBalancesQueryKey = (accountAddress?: string): string => 'getBalances'.concat(accountAddress || '');

const useGetBalances = (): UseGetBalances => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const accountId = useAccountId();
  const { selectedAccount } = useSubstrateSecureState();
  const { data: currencies, isSuccess: isCurrenciesSuccess } = useGetCurrencies(bridgeLoaded);
  const queryResult = useQuery({
    queryKey: getBalancesQueryKey(selectedAccount?.address),
    queryFn: () => (accountId && currencies ? getBalances(currencies, accountId) : undefined),
    enabled: selectedAccount && accountId && isCurrenciesSuccess && bridgeLoaded,
    refetchInterval: REFETCH_INTERVAL.BLOCK
  });

  const { data, error } = queryResult;

  useErrorHandler(error);

  const getBalance = useCallback((ticker: string) => data?.[ticker], [data]);

  const getAvailableBalance = useCallback((ticker: string) => getBalance(ticker)?.transferable, [getBalance]);

  return { ...queryResult, getBalance, getAvailableBalance };
};

export { getBalancesQueryKey, useGetBalances };
export type { BalanceData };
