import { ChainBalance, CurrencyExt } from '@interlay/interbtc-api';
import { createContext, useEffect, useRef } from 'react';
import { QueryClient, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { useSubstrateSecureState } from '@/lib/substrate';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';

import { BalanceData } from './types';

type UnsubscriptionsRef = Array<() => void> | null;

const updateBalances = (data: ChainBalance, queryClient: QueryClient) =>
  queryClient.setQueriesData<BalanceData>('getBalances', (oldData) => ({ ...oldData, [data.currency.ticker]: data }));

const subscribe = (currency: CurrencyExt, address: string, queryClient: QueryClient) => {
  const callback = (_: string, balance: ChainBalance) => updateBalances(balance, queryClient);
  return window.bridge.tokens.subscribeToBalance(currency, address, callback);
};

const BalanceStateContext = createContext(undefined);

const BalancesProvider: React.FC = ({ children }): JSX.Element => {
  const queryClient = useQueryClient();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { address } = useSubstrateSecureState().selectedAccount || {};
  const { data: currencies } = useGetCurrencies(bridgeLoaded);
  const unsubscriptionsRef = useRef<UnsubscriptionsRef>(null);

  useEffect(() => {
    const createSubscriptions = async (currencies: CurrencyExt[], address: string) => {
      const unsubscriptions = await Promise.all(
        currencies.map((currency) => subscribe(currency, address, queryClient))
      );

      unsubscriptionsRef.current = unsubscriptions;
    };

    if (currencies && address) {
      createSubscriptions(currencies, address);
    }

    return () => {
      unsubscriptionsRef.current?.map((unsubscribe) => unsubscribe());
      unsubscriptionsRef.current = null;
    };
  }, [address, currencies, queryClient]);

  return <BalanceStateContext.Provider value={undefined}>{children}</BalanceStateContext.Provider>;
};

export { BalancesProvider, BalanceStateContext };
