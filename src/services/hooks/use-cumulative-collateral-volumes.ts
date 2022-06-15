import { useQuery, UseQueryResult } from 'react-query';
import { CollateralUnit } from '@interlay/interbtc-api';


import { WRAPPED_TOKEN, CollateralToken } from 'config/relay-chains';

import cumulativeVolumesFetcher, {
  CUMULATIVE_VOLUMES_FETCHER,
  VolumeDataPoint,
  VolumeType
} from 'services/fetchers/cumulative-volumes-fetcher';



const useCumulativeCollateralVolumes = (
  collateralToken: CollateralToken,
  cutoffTimestamps: Array<Date>
): UseQueryResult<VolumeDataPoint<CollateralUnit>[], Error> => {
  

  return useQuery<VolumeDataPoint<CollateralUnit>[], Error>(
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