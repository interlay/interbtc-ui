import { newMonetaryAmount } from '@interlay/interbtc-api';
import {
  BitcoinUnit,
  Currency,
  MonetaryAmount
} from '@interlay/monetary-js';
import { CollateralToken, WRAPPED_TOKEN } from 'config/relay-chains';
import graphqlFetcher, { GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';

const CUMULATIVE_VOLUMES_FETCHER = 'cumulative-volumes-fetcher';

// TODO: should type properly (`Relay`)
type VolumeType = 'Issue' | 'Redeem';
type VolumeDataPoint = {
  amount: MonetaryAmount<Currency<BitcoinUnit>, BitcoinUnit>;
  tillTimestamp: Date;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const cumulativeVolumesFetcher = async ({ queryKey }: any): Promise<Array<VolumeDataPoint>> => {
  const [
    key,
    type,
    cutoffTimestamps,
    collateralCurrency
  ] = queryKey as CumulativeVolumesFetcherParams;

  if (key !== CUMULATIVE_VOLUMES_FETCHER) throw new Error('Invalid key!');

  const queryFragment = (type: VolumeType, date: Date, currency?: string) => {
    const where = `{
      tillTimestamp_lte: "${date.toISOString()}",
      type_eq: ${type},
      ${currency ? `currency: ${currency}` : ``}
    }`;
    const entityName = currency ? `cumulativeVolumePerCollaterals` : `cumulativeVolumes`;
    return `
      ts${date.getTime()}: ${entityName} (where: ${where}, limit: 1) {
        amount
        tillTimestamp
      }
    `;
  };

  const query = `
  {
    ${cutoffTimestamps.map(date => queryFragment(type, date, collateralCurrency?.ticker))}
  }
  `;

  // TODO: should type properly (`Relay`)
  const volumesData = await graphqlFetcher<Array<any>>()({
    queryKey: [
      GRAPHQL_FETCHER,
      query
    ]
  });

  // TODO: should type properly (`Relay`)
  const volumes = volumesData?.data || {};

  return Object.values(volumes).map(([volumeData], i) => ({
    amount: newMonetaryAmount(volumeData?.amount || 0, WRAPPED_TOKEN),
    tillTimestamp: cutoffTimestamps[i]
  }));
};

type CumulativeVolumesFetcherParams = [
  queryKey: string,
  type: VolumeType,
  cutoffTimestamps: Date[],
  collateralCurrency?: CollateralToken,
]

export {
  CUMULATIVE_VOLUMES_FETCHER
};

export type {
  CumulativeVolumesFetcherParams,
  VolumeType,
  VolumeDataPoint
};

export default cumulativeVolumesFetcher;
