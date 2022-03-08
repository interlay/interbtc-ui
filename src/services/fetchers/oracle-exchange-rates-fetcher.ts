import { CurrencyUnit, decodeFixedPointType } from '@interlay/interbtc-api';
import { OracleStatus } from '@interlay/interbtc-api/build/src/types/oracleTypes';
import {
  Currency,
  ExchangeRate,
  Bitcoin,
  BitcoinUnit
} from '@interlay/monetary-js';

import graphqlFetcher, { GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';
import oracleExchangeRatesQuery, { composableExchangeRateSubquery } from '../queries/oracle-exchange-rates-query';

const ORACLE_LATEST_EXCHANGE_RATE_FETCHER = 'oracle-exchange-rate-fetcher';
const ORACLE_ALL_LATEST_UPDATES_FETCHER = 'oracle-all-latest-updates-fetcher';

type BtcToCurrencyOracleStatus<U extends CurrencyUnit> = OracleStatus<Bitcoin, BitcoinUnit, Currency<U>, U>;

type LatestExchangeRateFetcherParams<U extends CurrencyUnit> = [
  key: string,
  currency: Currency<U>,
  onlineTimeout: number,
];

type AllOracleLatestUpdatesFetcherParams<U extends CurrencyUnit> = [
  key: string,
  currency: Currency<U>,
  onlineTimeout: number,
  namesMap: Map<string, string>
];

function decodeOracleValues<U extends CurrencyUnit>(
  updateData: any,
  currency: Currency<U>,
  onlineTimeout: number,
  namesMap: Map<string, string>
): BtcToCurrencyOracleStatus<U> {
  // updateValue is a bigint representing a FixedU128, the value is equivalent to an UnsignedFixedPoint
  const rate = decodeFixedPointType(updateData.updateValue);
  const lastUpdate = new Date(updateData.timestamp);
  return {
    id: updateData.oracleId,
    source: namesMap.get(updateData.oracleId) || updateData.oracleId,
    feed: `${Bitcoin.ticker}/${currency.ticker}`,
    lastUpdate,
    exchangeRate: new ExchangeRate<Bitcoin, BitcoinUnit, Currency<U>, U>(
      Bitcoin,
      currency,
      rate,
      Bitcoin.rawBase,
      currency.rawBase
    ),
    online: Date.now() <= (lastUpdate.getTime() + onlineTimeout)
  };
}

// TODO: should type properly (`Relay`)
const latestExchangeRateFetcher = async <U extends CurrencyUnit>(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  { queryKey }: any
): Promise<BtcToCurrencyOracleStatus<U> | undefined> => {
  const [key, currency, onlineTimeout] = queryKey as LatestExchangeRateFetcherParams<U>;

  if (key !== ORACLE_LATEST_EXCHANGE_RATE_FETCHER) throw new Error('Invalid key!');

  // TODO: should type properly (`Relay`)
  const latestOracleData = await graphqlFetcher<Array<any>>()({
    queryKey: [
      GRAPHQL_FETCHER,
      oracleExchangeRatesQuery(`typeKey_eq: "${currency.ticker}"`)
    ]
  });

  // TODO: should type properly (`Relay`)
  const rates = latestOracleData?.data?.oracleUpdates || [];
  return rates.map(update =>
    decodeOracleValues(
      update,
      currency,
      onlineTimeout,
      new Map([[update.oracleId, update.oracleId]]) // placeholder, as not used in card
    )
  )[0];
};

const allLatestSubmissionsFetcher = async<U extends CurrencyUnit>(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  { queryKey }: any
): Promise<BtcToCurrencyOracleStatus<U>[]> => {
  const [key, currency, onlineTimeout, namesMap] = queryKey as AllOracleLatestUpdatesFetcherParams<U>;

  if (key !== ORACLE_ALL_LATEST_UPDATES_FETCHER) throw new Error('Invalid key!');

  const query = [...namesMap.keys()].reduce(
    (queryStr, oracleId) =>
      queryStr + composableExchangeRateSubquery(
        `ID${oracleId}`,
        `typeKey_eq: "${currency.ticker}", oracleId_eq: "${oracleId}"`
      ),
    '{\n') + '\n}';

  // TODO: should type properly (`Relay`)
  const latestOracleData = await graphqlFetcher<Array<any>>()({
    queryKey: [
      GRAPHQL_FETCHER,
      query
    ]
  });

  const rates = latestOracleData?.data;
  return Object.values(rates)
    .filter(val => val.length > 0) // remove empty values (oracles with no submissions)
    .map(([update]) => decodeOracleValues(update, currency, onlineTimeout, namesMap));
};

export {
  ORACLE_LATEST_EXCHANGE_RATE_FETCHER,
  ORACLE_ALL_LATEST_UPDATES_FETCHER,
  latestExchangeRateFetcher,
  allLatestSubmissionsFetcher
};

export type {
  LatestExchangeRateFetcherParams,
  AllOracleLatestUpdatesFetcherParams,
  BtcToCurrencyOracleStatus
};
