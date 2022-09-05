import { CurrencyExt } from '@interlay/interbtc-api';
import {
  InterBtc, // on Polkadot
  Interlay, // On Polkadot
  KBtc, // on Kusama
  Kintsugi, // On Kusama
  Kusama, // on Kusama
  Polkadot // on Polkadot
} from '@interlay/monetary-js';
import { useCallback } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

const NATIVE_CURRENCIES: Array<CurrencyExt> = [Polkadot, InterBtc, Interlay, KBtc, Kintsugi, Kusama];

type UseGetCurrenciesResult = UseQueryResult<Array<CurrencyExt>> & {
  getCurrencyByTicker: (ticker: string) => CurrencyExt;
  getForeignCurrencyById: (id: number) => CurrencyExt;
};

const getCurrencies = async (): Promise<Array<CurrencyExt>> => {
  const foreignCurrencies = await window.bridge.assetRegistry.getForeignAssets();
  return [...NATIVE_CURRENCIES, ...foreignCurrencies];
};

// Returns all currencies, both native and foreign and helping utils to get currencies.
const useGetCurrencies = (bridgeLoaded: boolean): UseGetCurrenciesResult => {
  const queryResult = useQuery({ queryKey: 'getCurrencies', queryFn: getCurrencies, enabled: bridgeLoaded });

  const getCurrencyByTicker = useCallback(
    (ticker: string): CurrencyExt => {
      if (queryResult.data === undefined) {
        throw new Error('useGetCurrencies: Cannot call `getCurrencyByTicker` before currencies are loaded.');
      }

      const targetCurrency = queryResult.data.find((currency) => currency.ticker === ticker);
      if (targetCurrency === undefined) {
        throw new Error(`useGetCurrencies: getCurrencyByTicker: Currency with ticker ${ticker} not found.`);
      }

      return targetCurrency;
    },
    [queryResult.data]
  );

  const getForeignCurrencyById = useCallback(
    (id: number): CurrencyExt => {
      if (queryResult.data === undefined) {
        throw new Error('useGetCurrencies: Cannot call `getForeignCurrencyById` before currencies are loaded.');
      }

      const foreignCurrency = queryResult.data?.find((currency) => 'id' in currency && currency.id === id);
      if (foreignCurrency === undefined) {
        throw new Error(`useGetCurrencies: getForeignCurrencyById: Foreign currency with id ${id} not found.`);
      }

      return foreignCurrency;
    },
    [queryResult.data]
  );

  return { ...queryResult, getCurrencyByTicker, getForeignCurrencyById };
};

export { useGetCurrencies };
