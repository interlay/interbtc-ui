import { createInterBtcApi, InterBtcApi } from '@interlay/interbtc-api';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';

import * as constants from '@/constants';

type UseGetExchangeRateResult = UseQueryResult<InterBtcApi, unknown>;

const useApi = (): UseGetExchangeRateResult => {
  const queryResult = useQuery({
    queryKey: ['api'],
    queryFn: () => createInterBtcApi(constants.PARACHAIN_URL, constants.BITCOIN_NETWORK),
    refetchOnMount: false,
    refetchIntervalInBackground: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    cacheTime: Infinity
  });

  useErrorHandler(queryResult.error);

  return queryResult;
};

export { useApi };
export type { UseGetExchangeRateResult };
