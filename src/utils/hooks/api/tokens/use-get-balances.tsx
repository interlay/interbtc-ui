import { ChainBalance, CurrencyExt } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
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

const getBalancesQueryKey = (accountAddress?: string): string => 'getBalances'.concat(accountAddress || '');

const useGetBalances = (): UseQueryResult<BalanceData | undefined> => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const accountId = useAccountId();
  const { selectedAccount } = useSubstrateSecureState();
  const { data: currencies, isSuccess: isCurriencesSuccess } = useGetCurrencies(bridgeLoaded);
  const queryResult = useQuery({
    queryKey: getBalancesQueryKey(selectedAccount?.address),
    queryFn: () => (accountId && currencies ? getBalances(currencies, accountId) : undefined),
    enabled: selectedAccount && accountId && isCurriencesSuccess && bridgeLoaded
  });

  useErrorHandler(queryResult.error);

  return queryResult;
};

export { getBalancesQueryKey, useGetBalances };
export type { BalanceData };
