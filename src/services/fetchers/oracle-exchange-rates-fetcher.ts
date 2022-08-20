import { CurrencyExt, decodeFixedPointType } from '@interlay/interbtc-api';
import { OracleStatus } from '@interlay/interbtc-api/build/src/types/oracleTypes';
import { Bitcoin, ExchangeRate } from '@interlay/monetary-js';

import graphqlFetcher, { GRAPHQL_FETCHER } from '@/services/fetchers/graphql-fetcher';

import oracleExchangeRatesQuery, { composableExchangeRateSubquery } from '../queries/oracle-exchange-rates-query';

const ORACLE_LATEST_EXCHANGE_RATE_FETCHER = 'oracle-exchange-rate-fetcher';
const ORACLE_ALL_LATEST_UPDATES_FETCHER = 'oracle-all-latest-updates-fetcher';

type BtcToCurrencyOracleStatus = OracleStatus<Bitcoin, CurrencyExt>;

type LatestExchangeRateFetcherParams = [key: string, currency: CurrencyExt, onlineTimeout: number];

type AllOracleLatestUpdatesFetcherParams = [
  key: string,
  currency: CurrencyExt,
  onlineTimeout: number,
  namesMap: Map<string, string>
];

function decodeOracleValues(
  updateData: any,
  currency: CurrencyExt,
  onlineTimeout: number,
  namesMap: Map<string, string>
): BtcToCurrencyOracleStatus {
  // updateValue is a bigint representing a FixedU128, the value is equivalent to an UnsignedFixedPoint
  const rate = decodeFixedPointType(updateData.updateValue);
  const lastUpdate = new Date(updateData.timestamp);
  return {
    id: updateData.oracleId,
    source: namesMap.get(updateData.oracleId) || updateData.oracleId,
    feed: `${Bitcoin.ticker}/${currency.ticker}`,
    lastUpdate,
    exchangeRate: new ExchangeRate<Bitcoin, CurrencyExt>(Bitcoin, currency, rate),
    online: Date.now() <= lastUpdate.getTime() + onlineTimeout
  };
}

// TODO: should type properly (`Relay`)
const latestExchangeRateFetcher = async (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  { queryKey }: any
): Promise<BtcToCurrencyOracleStatus | undefined> => {
  const [key, currency, onlineTimeout] = queryKey as LatestExchangeRateFetcherParams;

  if (key !== ORACLE_LATEST_EXCHANGE_RATE_FETCHER) throw new Error('Invalid key!');

  // TODO: should type properly (`Relay`)
  const cond = 'id' in currency ? `asset_eq: ${currency.id}` : `token_eq: ${currency.ticker}`;
  const latestOracleData = await graphqlFetcher<Array<any>>()({
    queryKey: [GRAPHQL_FETCHER, oracleExchangeRatesQuery(`typeKey: {${cond}}`)]
  });

  // TODO: should type properly (`Relay`)
  const rates = latestOracleData?.data?.oracleUpdates || [];
  return rates.map((update) =>
    decodeOracleValues(
      update,
      currency,
      onlineTimeout,
      new Map([[update.oracleId, update.oracleId]]) // placeholder, as not used in card
    )
  )[0];
};

const allLatestSubmissionsFetcher = async (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  { queryKey }: any
): Promise<BtcToCurrencyOracleStatus[]> => {
  const [key, currency, onlineTimeout, namesMap] = queryKey as AllOracleLatestUpdatesFetcherParams;

  if (key !== ORACLE_ALL_LATEST_UPDATES_FETCHER) throw new Error('Invalid key!');

  const query =
    [...namesMap.keys()].reduce((queryStr, oracleId) => {
      const cond = 'id' in currency ? `asset_eq: ${currency.id}` : `token_eq: ${currency.ticker}`;
      return (
        queryStr + composableExchangeRateSubquery(`ID${oracleId}`, `typeKey: {${cond}}, oracleId_eq: "${oracleId}"`)
      );
    }, '{\n') + '\n}';

  // TODO: should type properly (`Relay`)
  const latestOracleData = await graphqlFetcher<Array<any>>()({
    queryKey: [GRAPHQL_FETCHER, query]
  });

  const rates = latestOracleData?.data;
  return Object.values(rates)
    .filter((val) => val.length > 0) // remove empty values (oracles with no submissions)
    .map(([update]) => decodeOracleValues(update, currency, onlineTimeout, namesMap));
};

export {
  allLatestSubmissionsFetcher,
  latestExchangeRateFetcher,
  ORACLE_ALL_LATEST_UPDATES_FETCHER,
  ORACLE_LATEST_EXCHANGE_RATE_FETCHER
};

export type { BtcToCurrencyOracleStatus };
