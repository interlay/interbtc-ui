import { CurrencyExt } from '@interlay/interbtc-api';
import {
  InterBtc, // on Polkadot
  Interlay, // On Polkadot
  KBtc, // on Kusama
  Kintsugi, // On Kusama
  Kusama, // on Kusama
  Polkadot // on Polkadot
} from '@interlay/monetary-js';
import { useQuery, UseQueryResult } from 'react-query';

const NATIVE_CURRENCIES: Array<CurrencyExt> = [Polkadot, InterBtc, Interlay, KBtc, Kintsugi, Kusama];

const getCurrencies = async (): Promise<Array<CurrencyExt>> => {
  const foreignCurrencies = await window.bridge.assetRegistry.getForeignAssets();
  return [...NATIVE_CURRENCIES, ...foreignCurrencies];
};

// Returns all currencies, both native and foreign.
const useGetCurrencies = (bridgeLoaded: boolean): UseQueryResult<Array<CurrencyExt>> => {
  return useQuery({ queryKey: 'getCurrencies', queryFn: getCurrencies, enabled: bridgeLoaded });
};

export { useGetCurrencies };
