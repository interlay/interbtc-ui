import { CollateralCurrencyExt } from '@interlay/interbtc-api';
import { useQuery, UseQueryResult } from 'react-query';

import { WRAPPED_TOKEN } from '@/config/relay-chains';
import cumulativeVolumesFetcher, {
  CUMULATIVE_VOLUMES_FETCHER,
  VolumeDataPoint,
  VolumeType
} from '@/services/fetchers/cumulative-volumes-fetcher';

const useCumulativeCollateralVolumes = (
  collateralToken: CollateralCurrencyExt,
  cutoffTimestamps: Array<Date>
): UseQueryResult<VolumeDataPoint[], Error> => {
  return useQuery<VolumeDataPoint[], Error>(
    [
      CUMULATIVE_VOLUMES_FETCHER,
      VolumeType.Collateral,
      cutoffTimestamps,
      collateralToken, // returned amounts
      collateralToken, // filter by this collateral...
      WRAPPED_TOKEN // and this backing currency
    ],
    cumulativeVolumesFetcher
  );
};

export default useCumulativeCollateralVolumes;
