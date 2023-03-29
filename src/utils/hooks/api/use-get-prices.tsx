import { CurrencyExt, ForeignAsset } from '@interlay/interbtc-api';
import { Bitcoin } from '@interlay/monetary-js';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { PRICES_API, REFETCH_INTERVAL } from '@/utils/constants/api';
import { COINGECKO_ID_BY_CURRENCY_TICKER } from '@/utils/constants/currency';

import { useGetCurrencies } from './use-get-currencies';

const getCoingeckoId = (currency: CurrencyExt) => {
  const asForeignAsset = currency as ForeignAsset;
  return asForeignAsset.foreignAsset?.coingeckoId || COINGECKO_ID_BY_CURRENCY_TICKER[currency.ticker];
};

const composeIds = (currencies: CurrencyExt[]): string =>
  currencies.reduce((acc, currency) => {
    const coingeckoId = getCoingeckoId(currency);
    if (!coingeckoId) {
      return acc;
    }

    if (!acc) {
      return coingeckoId;
    }

    return [acc, coingeckoId].join(',');
  }, '');

const composeEndpoint = (assetsIds: string): string => `${PRICES_API.URL}&ids=${assetsIds}`;

const getPricesByTicker = (currencies: CurrencyExt[], prices: Prices) =>
  currencies.reduce((acc, currency) => {
    const coingeckoId = getCoingeckoId(currency);
    return { ...acc, [currency.ticker]: prices[coingeckoId] };
  }, {});

const getPrices = async (currencies?: CurrencyExt[]): Promise<Prices | undefined> => {
  if (!currencies) {
    return;
  }

  const allCurrencies = [Bitcoin, ...currencies];
  const assetsIds = composeIds(allCurrencies);
  const url = composeEndpoint(assetsIds);

  const response = await fetch(url);
  const pricesByCoingeckoId = await response.json();

  return getPricesByTicker(allCurrencies, pricesByCoingeckoId);
};

type Price = {
  usd: number;
};

type Prices = {
  [ticker: string]: Price;
};

// TODO: return UseQueryResult<Prices | undefined, Error> type
const useGetPrices = (): Prices | undefined => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { data: currencies, isSuccess: isGetCurrenciesSuccess } = useGetCurrencies(bridgeLoaded);

  // TODO: error prone because the key computation is not complete
  const { data, error } = useQuery<Prices | undefined, Error>(['prices'], () => getPrices(currencies), {
    enabled: isGetCurrenciesSuccess,
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  useEffect(() => {
    if (!error) return;

    console.warn('Unable to fetch prices', error);
  }, [error]);

  return data;
};

export { useGetPrices };
export type { Price, Prices };
