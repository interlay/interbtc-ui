import { useQuery, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';

const useStableParachainConfirmations = (): UseQueryResult<number, Error> => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  return useQuery<number, Error>(
    [GENERIC_FETCHER, 'btcRelay', 'getStableParachainConfirmations'],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
};

export default useStableParachainConfirmations;
