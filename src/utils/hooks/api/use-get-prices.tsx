import { CurrencyExt, isForeignAsset, isLendToken, TickerToData } from '@interlay/interbtc-api';
import { Bitcoin } from '@interlay/monetary-js';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import Big from 'big.js';

import { StoreType } from '@/common/types/util.types';
import { PRICES_API, REFETCH_INTERVAL } from '@/utils/constants/api';
import { COINGECKO_ID_BY_CURRENCY_TICKER } from '@/utils/constants/currency';

import { useGetCurrencies } from './use-get-currencies';

// MEMO: Returns `undefined` for currencies without coingecko ID.
const getCoingeckoId = (currency: CurrencyExt) => {
  if (isForeignAsset(currency)) {
    return currency.foreignAsset.coingeckoId;
  }
  return COINGECKO_ID_BY_CURRENCY_TICKER[currency.ticker];
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

const fetchPricesFromCoingecko = async (endpoint: string) => {
  const response = await fetch(endpoint);
  return response.json();
};

const getPricesByTicker = (currencies: CurrencyExt[], prices: Prices, lendTokenPrices: TickerToData<Big>) =>
  currencies.reduce((acc, currency) => {
    const coingeckoId = getCoingeckoId(currency);

    if (isLendToken(currency)) {
      // MEMO: This works as long as lend tokens tickers
      // are same as underlying currencies with only `q` character prepended.
      const underlyingCurrencyTicker = currency.ticker.slice(1);
      const underlyingToLendTokenRate = lendTokenPrices[underlyingCurrencyTicker].toNumber();
      // MEMO: Can be extended to different counter currencies later if needed.
      const underlyingCurrencyPriceUSD = prices[underlyingCurrencyTicker].usd;
      const lendTokenPrice = { usd: underlyingCurrencyPriceUSD / underlyingToLendTokenRate };

      return { ...acc, [currency.ticker]: lendTokenPrice };
    }

    return { ...acc, [currency.ticker]: prices[coingeckoId] };
  }, {});

const getPrices = async (currencies?: CurrencyExt[]): Promise<Prices | undefined> => {
  if (!currencies) {
    return;
  }

  const allCurrencies = [Bitcoin, ...currencies];
  const assetsIds = composeIds(allCurrencies);
  const endpoint = composeEndpoint(assetsIds);

  const [pricesByCoingeckoId, lendTokenPrices] = await Promise.all([
    fetchPricesFromCoingecko(endpoint),
    window.bridge.loans.getLendTokenExchangeRates()
  ]);

  return getPricesByTicker(allCurrencies, pricesByCoingeckoId, lendTokenPrices);
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
