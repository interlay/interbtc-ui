import { CurrencyExt, InterbtcPrimitivesCurrencyId, tokenSymbolToCurrency } from '@interlay/interbtc-api';
import { useCallback } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

import { NATIVE_CURRENCIES } from '@/utils/constants/currency';

type UseGetCurrenciesResult = UseQueryResult<Array<CurrencyExt>> & {
  getCurrencyFromTicker: (ticker: string) => CurrencyExt;
  getForeignCurrencyFromId: (id: number) => CurrencyExt;
  getCurrencyFromIdPrimitive: (currencyPrimitive: InterbtcPrimitivesCurrencyId) => CurrencyExt;
};

const getCurrencies = async (): Promise<Array<CurrencyExt>> => {
  const [foreignCurrencies, lendCurrencies] = await Promise.all([
    window.bridge.assetRegistry.getForeignAssets(),
    window.bridge.loans.getLendTokens()
  ]);
  return [...NATIVE_CURRENCIES, ...foreignCurrencies, ...lendCurrencies];
};

// Returns all currencies, both native and foreign and helping utils to get CurrencyExt object.
const useGetCurrencies = (bridgeLoaded: boolean): UseGetCurrenciesResult => {
  const queryResult = useQuery({ queryKey: 'getCurrencies', queryFn: getCurrencies, enabled: bridgeLoaded });

  // Throws when passed parameter is not ticker of any currency or currencies are not loaded yet.
  const getCurrencyFromTicker = useCallback(
    (ticker: string): CurrencyExt => {
      if (queryResult.data === undefined) {
        throw new Error('useGetCurrencies: Cannot call `getCurrencyFromTicker` before currencies are loaded.');
      }

      const targetCurrency = queryResult.data.find((currency) => currency.ticker === ticker);
      if (targetCurrency === undefined) {
        throw new Error(`useGetCurrencies: getCurrencyFromTicker: Currency with ticker ${ticker} not found.`);
      }

      return targetCurrency;
    },
    [queryResult]
  );

  // Throws when passed parameter is not id of any foreign currency or currencies are not loaded yet.
  const getForeignCurrencyFromId = useCallback(
    (id: number): CurrencyExt => {
      if (queryResult.data === undefined) {
        throw new Error('useGetCurrencies: Cannot call `getForeignCurrencyFromId` before currencies are loaded.');
      }

      const foreignCurrency = queryResult.data.find(
        (currency) => 'foreignAsset' in currency && currency.foreignAsset.id === id
      );
      if (foreignCurrency === undefined) {
        throw new Error(`useGetCurrencies: getForeignCurrencyFromId: Foreign currency with id ${id} not found.`);
      }

      return foreignCurrency;
    },
    [queryResult]
  );

  // TODO: add `getLendTokenFromId` or similar to be able to synchronously obtain lend tokens from id primitive
  // Throws when passed parameter is not id of any foreign currency or currencies are not loaded yet.
  const getLendCurrencyFromId = useCallback(
    (id: number): CurrencyExt => {
      if (queryResult.data === undefined) {
        throw new Error('useGetCurrencies: Cannot call `getForeignCurrencyFromId` before currencies are loaded.');
      }

      const foreignCurrency = queryResult.data.find(
        (currency) => 'lendToken' in currency && currency.lendToken.id === id
      );
      if (foreignCurrency === undefined) {
        throw new Error(`useGetCurrencies: getForeignCurrencyFromId: Foreign currency with id ${id} not found.`);
      }

      return foreignCurrency;
    },
    [queryResult]
  );

  // Throws when passed parameter is not primitiveId of any currency or currencies are not loaded yet.
  // Synchronous function which has the same functionality as async `currencyIdToMonetaryCurrency` in lib.
  const getCurrencyFromIdPrimitive = useCallback(
    (currencyPrimitive: InterbtcPrimitivesCurrencyId) => {
      switch (true) {
        case currencyPrimitive.isToken:
          return tokenSymbolToCurrency(currencyPrimitive.asToken);
        case currencyPrimitive.isForeignAsset:
          return getForeignCurrencyFromId(currencyPrimitive.asForeignAsset.toNumber());
        case currencyPrimitive.isLendToken:
          return getLendCurrencyFromId(currencyPrimitive.asLendToken.toNumber());
        default:
          throw new Error(`No handling implemented for currencyId type of ${currencyPrimitive.type}`);
      }
    },
    [getForeignCurrencyFromId, getLendCurrencyFromId]
  );

  return { ...queryResult, getCurrencyFromTicker, getForeignCurrencyFromId, getCurrencyFromIdPrimitive };
};

export { useGetCurrencies };
