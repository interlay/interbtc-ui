import { ChainBalance, CurrencyExt, isCurrencyEqual, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { TokenInputProps } from '@/component-library';
import { useSubstrateSecureState } from '@/lib/substrate';
import { REFETCH_INTERVAL } from '@/utils/constants/api';
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
  // TODO: make not optional
  getAvailableBalance: (ticker: string, feeAmount?: MonetaryAmount<CurrencyExt>) => ChainBalance['free'] | undefined;
  getBalanceInputProps: (
    ticker: string,
    feeAmount?: MonetaryAmount<CurrencyExt>
  ) => Pick<TokenInputProps, 'balance' | 'humanBalance'>;
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

  const getAvailableBalance = useCallback(
    (ticker: string, feeAmount?: MonetaryAmount<CurrencyExt>) => {
      const balance = getBalance(ticker)?.transferable;

      if (!feeAmount) {
        return balance;
      }

      if (!balance) {
        return undefined;
      }

      const isBalanceAndFeeSameCurrency = isCurrencyEqual(balance.currency, feeAmount.currency);

      if (!isBalanceAndFeeSameCurrency) {
        return balance;
      }

      return balance.gte(feeAmount) ? balance.sub(feeAmount) : newMonetaryAmount(0, balance.currency);
    },
    [getBalance]
  );

  const getBalanceInputProps = useCallback(
    (ticker: string, feeAmount?: MonetaryAmount<CurrencyExt>) => {
      const balance = getAvailableBalance(ticker, feeAmount);

      return {
        balance: balance?.toString() || 0,
        humanBalance: balance?.toHuman() || 0
      };
    },
    [getAvailableBalance]
  );

  return { ...queryResult, getBalance, getAvailableBalance, getBalanceInputProps };
};

export { getBalancesQueryKey, useGetBalances };
export type { BalanceData };
