import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';

import { REFETCH_INTERVAL } from '@/utils/constants/api';

type ParachainStatusData = {
  isRunning: boolean;
  isShutdown: boolean;
  isError: boolean;
};

type UseGetParachainStatusResult = UseQueryResult<ParachainStatusData, unknown>;

const getStatus = async (): Promise<ParachainStatusData> => {
  const statusCode = await window.bridge.system.getStatusCode();

  return {
    isRunning: Boolean(statusCode.isRunning),
    isError: Boolean(statusCode.isError),
    isShutdown: Boolean(statusCode.isShutdown)
  };
};

const useGetParachainStatus = (): UseGetParachainStatusResult => {
  const queryResult = useQuery({
    queryKey: 'parachain-status',
    queryFn: getStatus,
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  useErrorHandler(queryResult.error);

  return queryResult;
};

export { useGetParachainStatus };
export type { ParachainStatusData, UseGetParachainStatusResult };
