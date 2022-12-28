import { CurrencyExt, ForeignAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { Bitcoin, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { PRICES_API } from '@/utils/constants/api';
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

const composeUrl = (assetsIds: string): string => {
  const url = new URL(PRICES_API.URL);
  url.searchParams.append(PRICES_API.QUERY_PARAMETERS.ASSETS_IDS, assetsIds);

  return url.toString();
};

const fetchAPI = async (currencies: CurrencyExt[]): Promise<Prices> => {
  const assetsIds = composeIds(currencies);
  const url = composeUrl(assetsIds);

  const response = await fetch(url);
  return response.json();
};

/**
 * Fetched prices from an API (i.e. CoinGecko)
 * @param {CurrencyExt[]} currencies Currencies to be fetched.
 * @return {Promise<Prices>} Prices groupped by currency tickers
 */
const getCoinGeckoPrices = async (currencies: CurrencyExt[]): Promise<Prices> => {
  const data = await fetchAPI(currencies);

  return currencies.reduce((acc, currency) => {
    const coingeckoId = getCoingeckoId(currency);
    return { ...acc, [currency.ticker]: data[coingeckoId] };
  }, {});
};

const baseBTCAmount = newMonetaryAmount(1, Bitcoin, true);

const calculateCurrencyPrice = (btcPriceUSD: Big, exchangeRate: ExchangeRate<Bitcoin, CurrencyExt>): Big => {
  const currencyExchangeRate = exchangeRate.toCounter(baseBTCAmount).toBig();
  return btcPriceUSD.div(currencyExchangeRate);
};

const getOracleCurrencyPrice = async (btcPriceUSD: Big, currency: CurrencyExt): Promise<Big> => {
  if (currency.ticker === WRAPPED_TOKEN.ticker) {
    return btcPriceUSD;
  }

  try {
    const exchangeRate = await window.bridge.oracle.getExchangeRate(currency);

    return calculateCurrencyPrice(btcPriceUSD, exchangeRate);
  } catch (e) {
    return new Big(0);
  }
};

/**
 * Fetched prices from an oracle are based on exchange rates between the currency
 * and BTC (i.e USDT/BTC). That's why only the price of bitcoin is fetched from
 * external api (i.e CoinGecko). By using the exchange rate between a currency and
 * BTC and the current BTC price, we are able to calculate the price of that currency.
 *
 * @param {CurrencyExt[]} currencies Currencies to be fetched.
 * @return {Promise<Prices>} Prices groupped by currency tickers
 */
const getOraclePrices = async (currencies: CurrencyExt[]): Promise<Prices> => {
  const data = await fetchAPI([Bitcoin]);

  const btcCoinGeckoId = COINGECKO_ID_BY_CURRENCY_TICKER[Bitcoin.ticker];
  const btcPriceUSD = new Big(data[btcCoinGeckoId].usd);

  const prices = await Promise.all(
    currencies.map(async (currency) => ({ currency, value: await getOracleCurrencyPrice(btcPriceUSD, currency) }))
  );

  return prices.reduce(
    (acc: Prices, price) => ({ ...acc, [price.currency.ticker]: { usd: price.value.toNumber() } }),
    {}
  );
};

/**
 * Fetched currencies prices according to the specified source (api or oracle)
 * @param {PriceSource} source From where the prices will be fetched from.
 * @param {CurrencyExt[]} currencies Currencies to be fetched.
 * @return {Big} Prices groupped by currency tickers
 */
const getPrices = async (source: PriceSource, currencies: CurrencyExt[]): Promise<Prices | undefined> => {
  if (source === PriceSource.ORACLE) {
    return getOraclePrices(currencies);
  }

  const allCurrencies = [Bitcoin, ...currencies];
  return await getCoinGeckoPrices(allCurrencies);
};

type Price = {
  usd: number;
};

type Prices = {
  [ticker: string]: Price;
};

enum PriceSource {
  ORACLE = 'oracle',
  API = 'api'
}

type UseGetPricesOption = {
  source: PriceSource;
};

const defaultOptions: UseGetPricesOption = { source: PriceSource.API };

// TODO: return UseQueryResult<Prices | undefined, Error> type
const useGetPrices = (options = defaultOptions): Prices | undefined => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { data: currencies, isSuccess: isGetCurrenciesSuccess } = useGetCurrencies(bridgeLoaded);
  const { data, error } = useQuery<Prices | undefined, Error>(
    [options.source, 'prices'],
    () => currencies && getPrices(options.source, currencies),
    {
      enabled: isGetCurrenciesSuccess,
      refetchInterval: 60000
    }
  );

  useEffect(() => {
    if (!error) return;

    console.warn('Unable to fetch prices', error);
  }, [error]);

  return data;
};

export { PriceSource, useGetPrices };
export type { Price, Prices };
