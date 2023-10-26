import { CurrencyExt, decodeFixedPointType } from '@interlay/interbtc-api';
import { OracleStatus } from '@interlay/interbtc-api/build/types/src/types/oracleTypes';
import { Bitcoin, ExchangeRate } from '@interlay/monetary-js';

import graphqlFetcher, { GRAPHQL_FETCHER } from '@/services/fetchers/graphql-fetcher';
import { getCurrencyEqualityCondition } from '@/utils/helpers/currencies';

import { composableExchangeRateSubquery } from '../queries/oracle-exchange-rates-query';

const ORACLE_ALL_LATEST_UPDATES_FETCHER = 'oracle-all-latest-updates-fetcher';

type BtcToCurrencyOracleStatus = OracleStatus<Bitcoin, CurrencyExt>;

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

const allLatestSubmissionsFetcher = async (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  { queryKey }: any
): Promise<BtcToCurrencyOracleStatus[]> => {
  const [key, currency, onlineTimeout, namesMap] = queryKey as AllOracleLatestUpdatesFetcherParams;

  if (key !== ORACLE_ALL_LATEST_UPDATES_FETCHER) throw new Error('Invalid key!');

  const query =
    [...namesMap.keys()].reduce((queryStr, oracleId) => {
      const cond = getCurrencyEqualityCondition(currency);
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

export { allLatestSubmissionsFetcher, ORACLE_ALL_LATEST_UPDATES_FETCHER };

export type { BtcToCurrencyOracleStatus };
