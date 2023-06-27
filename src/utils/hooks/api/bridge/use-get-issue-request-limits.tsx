import { IssueLimits } from '@interlay/interbtc-api/build/src/parachain/issue';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryOptions } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

const getIssueRequestLimits = async (): Promise<IssueLimits> => window.bridge.issue.getRequestLimits();

type UseGetIssueRequestLimitResult = {
  data: IssueLimits | undefined;
  refetch: () => void;
};

type UseGetIssueRequestLimitProps = UseQueryOptions<IssueLimits, unknown, IssueLimits, 'issue-request-limit'>;

const useGetIssueRequestLimit = (props?: UseGetIssueRequestLimitProps): UseGetIssueRequestLimitResult => {
  const queryResult = useQuery({
    queryKey: 'issue-request-limit',
    queryFn: getIssueRequestLimits,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL,
    ...props
  });

  useErrorHandler(queryResult.error);

  return queryResult;
};

export { useGetIssueRequestLimit };
export type { UseGetIssueRequestLimitResult };
