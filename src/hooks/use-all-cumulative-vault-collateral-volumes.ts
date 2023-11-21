import { TickerToData } from '@interlay/interbtc-api';
import { useQuery, UseQueryResult } from 'react-query';

import cumulativeVaultCollateralVolumesFetcher, {
  CUMULATIVE_VAULT_COLLATERALVOLUMES_FETCHER
} from '@/services/fetchers/cumulative-vault-collateral-volumes-fetcher';
import { VolumeDataPoint } from '@/services/fetchers/cumulative-volumes-fetcher';

import { useGetCollateralCurrencies } from './api/use-get-collateral-currencies';

const useAllCumulativeVaultCollateralVolumes = (
  cutoffTimestamps: Array<Date>
): UseQueryResult<TickerToData<Array<VolumeDataPoint>>, Error> => {
  const { data: collateralCurrencies } = useGetCollateralCurrencies(true);

  return useQuery<TickerToData<Array<VolumeDataPoint>>, Error>(
    [CUMULATIVE_VAULT_COLLATERALVOLUMES_FETCHER, cutoffTimestamps, collateralCurrencies],
    cumulativeVaultCollateralVolumesFetcher,
    {
      enabled: !!collateralCurrencies
    }
  );
};

export default useAllCumulativeVaultCollateralVolumes;
