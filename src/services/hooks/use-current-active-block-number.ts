import { useQuery, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';

import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

// ray test touch <
// TODO: should refactor with this hook
// ray test touch >
const useCurrentActiveBlockNumber = (): UseQueryResult<number, Error> => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  return useQuery<number, Error>([GENERIC_FETCHER, 'system', 'getCurrentActiveBlockNumber'], genericFetcher<number>(), {
    enabled: !!bridgeLoaded
  });
};

export default useCurrentActiveBlockNumber;
