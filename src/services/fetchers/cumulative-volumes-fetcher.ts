import { CollateralCurrencyExt, CurrencyExt, newMonetaryAmount, WrappedCurrency } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import graphqlFetcher, { GRAPHQL_FETCHER } from '@/services/fetchers/graphql-fetcher';
import { getCurrencyEqualityCondition } from '@/utils/helpers/currencies';

const CUMULATIVE_VOLUMES_FETCHER = 'cumulative-volumes-fetcher';

// TODO: should type properly (`Relay`)
enum VolumeType {
  Issued = 'Issued',
  Redeemed = 'Redeemed',
  Collateral = 'Collateral',
  Staked = 'Staked'
}
type VolumeDataPoint = {
  amount: MonetaryAmount<CurrencyExt>;
  tillTimestamp: Date;
};

const cumulativeVolumesFetcher = async (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  { queryKey }: any
): Promise<Array<VolumeDataPoint>> => {
  const [
    key,
    type,
    cutoffTimestamps,
    returnCurrency,
    collateralCurrency,
    wrappedCurrency
  ] = queryKey as CumulativeVolumesFetcherParams;

  if (key !== CUMULATIVE_VOLUMES_FETCHER) throw new Error('Invalid key!');

  const queryFragment = (
    type: VolumeType,
    date: Date,
    collateralCurrency?: CurrencyExt,
    wrappedCurrency?: CurrencyExt
  ) => {
    const where = `{
      tillTimestamp_lte: "${date.toISOString()}",
      type_eq: ${type},
      ${
        collateralCurrency
          ? `collateralCurrency: {
        ${getCurrencyEqualityCondition(collateralCurrency)}}`
          : ``
      },
      ${
        wrappedCurrency
          ? `wrappedCurrency: {
        ${getCurrencyEqualityCondition(wrappedCurrency)}}`
          : ``
      },
    }`;
    const entityName = collateralCurrency || wrappedCurrency ? `cumulativeVolumePerCurrencyPairs` : `cumulativeVolumes`;
    return `
      ts${date.getTime()}: ${entityName} (where: ${where}, orderBy: tillTimestamp_DESC, limit: 1) {
        amount
        tillTimestamp
      }
    `;
  };

  const query = `
  {
    ${cutoffTimestamps.map((date) => queryFragment(type, date, collateralCurrency, wrappedCurrency))}
  }
  `;

  // TODO: should type properly (`Relay`)
  const volumesData = await graphqlFetcher<Array<any>>()({
    queryKey: [GRAPHQL_FETCHER, query]
  });

  const volumes = volumesData?.data || {};

  return Object.values(volumes).map(([volumeData], i) => ({
    amount: newMonetaryAmount(volumeData?.amount || 0, returnCurrency),
    tillTimestamp: cutoffTimestamps[i]
  }));
};

type CumulativeVolumesFetcherParams =
  | [
      queryKey: string,
      type: VolumeType,
      cutoffTimestamps: Date[],
      returnCurrency: CurrencyExt,
      collateralCurrency: CollateralCurrencyExt,
      wrappedCurrency: WrappedCurrency
    ]
  | [queryKey: string, type: VolumeType, cutoffTimestamps: Date[], returnCurrency: CurrencyExt];

export { CUMULATIVE_VOLUMES_FETCHER, VolumeType };

export type { VolumeDataPoint };

export default cumulativeVolumesFetcher;
