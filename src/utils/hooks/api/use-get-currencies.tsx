import { CurrencyExt, InterbtcPrimitivesCurrencyId, tokenSymbolToCurrency } from '@interlay/interbtc-api';
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
  getCurrencyFromTicker: (ticker: string) => CurrencyExt;
  getForeignCurrencyFromId: (id: number) => CurrencyExt;
  getCurrencyFromIdPrimitive: (currencyPrimitive: InterbtcPrimitivesCurrencyId) => CurrencyExt;
};

const getCurrencies = async (): Promise<Array<CurrencyExt>> => {
  const foreignCurrencies = await window.bridge.assetRegistry.getForeignAssets();
  return [...NATIVE_CURRENCIES, ...foreignCurrencies];
};

// Returns all currencies, both native and foreign and helping utils to get CurrencyExt object.
const useGetCurrencies = (bridgeLoaded: boolean): UseGetCurrenciesResult => {
  const queryResult = useQuery({ queryKey: 'getCurrencies', queryFn: getCurrencies, enabled: bridgeLoaded });

  const getCurrencyFromTicker = useCallback(
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

  const getForeignCurrencyFromId = useCallback(
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

  const getCurrencyFromIdPrimitive = useCallback(
    (currencyPrimitive: InterbtcPrimitivesCurrencyId) => {
      if (currencyPrimitive.isToken) {
        return tokenSymbolToCurrency(currencyPrimitive.asToken);
      } else if (currencyPrimitive.isForeignAsset) {
        return getForeignCurrencyFromId(currencyPrimitive.asForeignAsset.toNumber());
      }
      throw new Error(`No handling implemented for currencyId type of ${currencyPrimitive.type}`);
    },
    [getForeignCurrencyFromId]
  );

  return { ...queryResult, getCurrencyFromTicker, getForeignCurrencyFromId, getCurrencyFromIdPrimitive };
};

export { useGetCurrencies };
