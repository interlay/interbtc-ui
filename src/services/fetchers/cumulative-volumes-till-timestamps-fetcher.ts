import { newMonetaryAmount, CurrencyUnit } from '@interlay/interbtc-api';
import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import { CollateralToken, WrappedToken } from 'config/relay-chains';
import graphqlFetcher, { GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';

const CUMULATIVE_VOLUMES_FETCHER = 'cumulative-volumes-fetcher';

// TODO: should type properly (`Relay`)
type VolumeType = 'Issue' | 'Redeem';
type VolumeDataPoint<U extends CurrencyUnit> = {
  amount: MonetaryAmount<Currency<U>, U>;
  tillTimestamp: Date;
};

const cumulativeVolumesFetcher = async <U extends CurrencyUnit>(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  { queryKey }: any
): Promise<Array<VolumeDataPoint<U>>> => {
  const [
    key,
    type,
    cutoffTimestamps,
    returnCurrency,
    collateralCurrency,
    wrappedCurrency
  ] = queryKey as CumulativeVolumesFetcherParams<U>;

  if (key !== CUMULATIVE_VOLUMES_FETCHER) throw new Error('Invalid key!');

  const queryFragment = (type: VolumeType, date: Date, collateralCurrency?: string, wrappedCurrency?: string) => {
    const where = `{
      tillTimestamp_lte: "${date.toISOString()}",
      type_eq: ${type},
      ${
        collateralCurrency && wrappedCurrency
          ? `
        collateralCurrency_eq: ${collateralCurrency},
        wrappedCurrency_eq: ${wrappedCurrency}
        `
          : `
      `
      }
    }`;
    const entityName = collateralCurrency ? `cumulativeVolumePerCurrencyPairs` : `cumulativeVolumes`;
    return `
      ts${date.getTime()}: ${entityName} (where: ${where}, orderBy: tillTimestamp_DESC, limit: 1) {
        amount
        tillTimestamp
      }
    `;
  };

  const query = `
  {
    ${cutoffTimestamps.map((date) => queryFragment(type, date, collateralCurrency?.ticker, wrappedCurrency?.ticker))}
  }
  `;

  // TODO: should type properly (`Relay`)
  const volumesData = await graphqlFetcher<Array<any>>()({
    queryKey: [GRAPHQL_FETCHER, query]
  });

  // TODO: should type properly (`Relay`)
  const volumes = volumesData?.data || {};

  return Object.values(volumes).map(([volumeData], i) => ({
    amount: newMonetaryAmount<U>(volumeData?.amount || 0, returnCurrency),
    tillTimestamp: cutoffTimestamps[i]
  }));
};

type CumulativeVolumesFetcherParams<U extends CurrencyUnit> =
  | [
      queryKey: string,
      type: VolumeType,
      cutoffTimestamps: Date[],
      returnCurrency: Currency<U>,
      collateralCurrency: CollateralToken,
      wrappedCurrency: WrappedToken
    ]
  | [queryKey: string, type: VolumeType, cutoffTimestamps: Date[], returnCurrency: Currency<U>];

export { CUMULATIVE_VOLUMES_FETCHER };

export type { CumulativeVolumesFetcherParams, VolumeType, VolumeDataPoint };

export default cumulativeVolumesFetcher;
