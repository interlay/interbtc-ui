import { ChainBalance, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { useSubstrateSecureState } from '@/lib/substrate';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import useAccountId from '@/utils/hooks/use-account-id';

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
    enabled: selectedAccount && accountId && isCurrenciesSuccess && bridgeLoaded
  });

  const { data, error } = queryResult;

  useErrorHandler(error);

  const getBalance = useCallback((ticker: string) => data?.[ticker], [data]);

  // return available balance as well known as free field (ChainBalance).
  // if the ticker is governance, the necessary for fees will be deducted
  // from the return value
  const getAvailableBalance = useCallback(
    (ticker: string) => {
      const { free } = getBalance(ticker) || {};

      if (ticker === GOVERNANCE_TOKEN.ticker) {
        if (!free) return undefined;

        const governanceBalance = free.sub(TRANSACTION_FEE_AMOUNT);

        return governanceBalance.toBig().gte(0) ? governanceBalance : newMonetaryAmount(0, governanceBalance.currency);
      }

      return free;
    },
    [getBalance]
  );

  return { ...queryResult, getBalance, getAvailableBalance };
};

export { getBalancesQueryKey, useGetBalances };
export type { BalanceData };
