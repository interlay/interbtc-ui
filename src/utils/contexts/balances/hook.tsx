import { CurrencyExt } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import useAccountId from '@/utils/hooks/use-account-id';

import { BalanceData } from './types';

const BALANCES_QUERY_KEY = 'getBalances';

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

const useGetBalances = (): UseQueryResult<BalanceData | undefined> => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const accountId = useAccountId();
  const { data: currencies, isSuccess } = useGetCurrencies(bridgeLoaded);
  const queryResult = useQuery({
    queryKey: BALANCES_QUERY_KEY,
    queryFn: () => (accountId && currencies ? getBalances(currencies, accountId) : undefined),
    enabled: accountId && isSuccess && bridgeLoaded
  });

  useErrorHandler(queryResult.error);

  return queryResult;
};

export { BALANCES_QUERY_KEY, useGetBalances };
