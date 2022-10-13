import { ChainBalance, CurrencyExt } from '@interlay/interbtc-api';
import { FC, Fragment, useEffect, useRef } from 'react';
import { QueryClient, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { useSubstrateSecureState } from '@/lib/substrate';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';

import { BalanceData, BALANCES_QUERY_KEY } from './use-get-balances';

type UnsubscriptionsRef = Array<() => void> | null;

const updateBalances = (data: ChainBalance, queryClient: QueryClient) =>
  queryClient.setQueriesData<BalanceData>(BALANCES_QUERY_KEY, (oldData) => ({
    ...oldData,
    [data.currency.ticker]: data
  }));

const subscribe = (currency: CurrencyExt, address: string, queryClient: QueryClient) => {
  const callback = (_: string, balance: ChainBalance) => updateBalances(balance, queryClient);
  return window.bridge.tokens.subscribeToBalance(currency, address, callback);
};

const unsubscribeAll = (refs: UnsubscriptionsRef) => {
  refs?.map((unsubscribe) => unsubscribe());
  refs = null;
};

const useBalanceSubscription = (): void => {
  const queryClient = useQueryClient();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { address } = useSubstrateSecureState().selectedAccount || {};
  const { data: currencies } = useGetCurrencies(bridgeLoaded);
  const unsubscriptionsRef = useRef<UnsubscriptionsRef>(null);

  useEffect(() => {
    const createSubscriptions = async (currencies: CurrencyExt[], address: string) => {
      // Unsubscribe previous created subscriptions (i.e. when there is a account transition)
      if (unsubscriptionsRef.current) {
        unsubscribeAll(unsubscriptionsRef.current);
      }

      const unsubscriptions = await Promise.all(
        currencies.map((currency) => subscribe(currency, address, queryClient))
      );

      unsubscriptionsRef.current = unsubscriptions;
    };

    if (currencies && address) {
      createSubscriptions(currencies, address);
    }

    return () => unsubscribeAll(unsubscriptionsRef.current);
  }, [address, currencies, queryClient]);
};

// TODO: move this elsewhere, once we start handling more subscriptions
const Subscriptions: FC = ({ children }) => {
  useBalanceSubscription();

  return <Fragment>{children}</Fragment>;
};

export { Subscriptions, useBalanceSubscription };
