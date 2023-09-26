import { CollateralCurrencyExt, CurrencyExt, newMonetaryAmount, TickerToData } from '@interlay/interbtc-api';

import { WRAPPED_TOKEN } from '@/config/relay-chains';
import graphqlFetcher, { GRAPHQL_FETCHER } from '@/services/fetchers/graphql-fetcher';
import { getCurrencyEqualityCondition } from '@/utils/helpers/currencies';

import { VolumeDataPoint } from './cumulative-volumes-fetcher';

const CUMULATIVE_VAULT_COLLATERALVOLUMES_FETCHER = 'cumulative-vault-collateral-volumes-fetcher';

const cumulativeVaultCollateralVolumesFetcher = async (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  { queryKey }: any
): Promise<TickerToData<Array<VolumeDataPoint>>> => {
  const [key, cutoffTimestamps, collateralCurrencies] = queryKey as CumulativeVaultCollateralVolumesFetcherParams;

  if (key !== CUMULATIVE_VAULT_COLLATERALVOLUMES_FETCHER) throw new Error('Invalid key!');

  const queryFragment = (date: Date, collateralCurrency: CurrencyExt) => {
    const where = `{
      tillTimestamp_lte: "${date.toISOString()}",
      type_eq: Collateral,
      ${`collateralCurrency: {
        ${getCurrencyEqualityCondition(collateralCurrency)}}`},
      ${`wrappedCurrency: {
        ${getCurrencyEqualityCondition(WRAPPED_TOKEN)}}`},
    }`;

    return `
      ts${date.getTime()}_${
      collateralCurrency?.ticker
    }: cumulativeVolumePerCurrencyPairs (where: ${where}, orderBy: tillTimestamp_DESC, limit: 1) {
        amount
        tillTimestamp
      }
    `;
  };

  const query = `
  {
    ${cutoffTimestamps.map((date) => collateralCurrencies.map((currency) => queryFragment(date, currency)))}
  }
  `;

  // TODO: should type properly (`Relay`)
  const volumesData = await graphqlFetcher<Array<any>>()({
    queryKey: [GRAPHQL_FETCHER, query]
  });

  const volumes = volumesData?.data || {};

  return Object.entries(volumes).reduce((result, [key, [volumeData]]) => {
    const [rawTimestamp, ticker] = key.split('_');
    const timestamp = rawTimestamp.slice(2);
    const currency = collateralCurrencies.find((collateralCurrency) => collateralCurrency.ticker === ticker);
    if (currency === undefined) {
      throw new Error('Ivalid query.');
    }
    return {
      ...result,
      [ticker]: [
        ...(result[ticker] || []),
        {
          amount: newMonetaryAmount(volumeData.amount || 0, currency),
          tillTimestamp: cutoffTimestamps.find((cutoffTimestamp) => cutoffTimestamp.getTime().toString() === timestamp)
        }
      ]
    };
  }, {} as any);
};

type CumulativeVaultCollateralVolumesFetcherParams = [
  queryKey: string,
  cutoffTimestamp: Array<Date>,
  collateralCurrency: Array<CollateralCurrencyExt>
];

export { CUMULATIVE_VAULT_COLLATERALVOLUMES_FETCHER };

export default cumulativeVaultCollateralVolumesFetcher;
