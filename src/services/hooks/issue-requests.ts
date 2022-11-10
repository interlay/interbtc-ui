import { useQuery } from 'react-query';

import issuesFetcher, { getIssueWithStatus, ISSUES_FETCHER } from '@/services/fetchers/issues-fetcher';
import useCurrentActiveBlockNumber from '@/services/hooks/use-current-active-block-number';
import useStableBitcoinConfirmations from '@/services/hooks/use-stable-bitcoin-confirmations';
import useStableParachainConfirmations from '@/services/hooks/use-stable-parachain-confirmations';
import { IssueRequest, IssueRequestWithStatusDecoded } from '@/types/issues.d';

const useIssueRequests = (
  offset: number,
  limit: number,
  whereCondition: string | undefined,
  refetchInterval?: number | false | undefined
): {
  isIdle: boolean;
  isLoading: boolean;
  data: Array<IssueRequestWithStatusDecoded> | undefined;
  error: Error | null;
} => {
  const {
    isIdle: stableBitcoinConfirmationsIdle,
    isLoading: stableBitcoinConfirmationsLoading,
    data: stableBitcoinConfirmations,
    error: stableBitcoinConfirmationsError
  } = useStableBitcoinConfirmations();

  const {
    isIdle: stableParachainConfirmationsIdle,
    isLoading: stableParachainConfirmationsLoading,
    data: stableParachainConfirmations,
    error: stableParachainConfirmationsError
  } = useStableParachainConfirmations();

  const {
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber,
    error: currentActiveBlockNumberError
  } = useCurrentActiveBlockNumber();

  const {
    isIdle: issueRequestsIdle,
    isLoading: issueRequestsLoading,
    data: issueRequests,
    error: issueRequestsError
  } = useQuery<Array<IssueRequest>, Error>(
    whereCondition === undefined ? [ISSUES_FETCHER, offset, limit] : [ISSUES_FETCHER, offset, limit, whereCondition],
    issuesFetcher,
    {
      refetchInterval
    }
  );

  const data: Array<IssueRequestWithStatusDecoded> | undefined =
    issueRequests === undefined ||
    stableBitcoinConfirmations === undefined ||
    stableParachainConfirmations === undefined ||
    currentActiveBlockNumber === undefined
      ? undefined
      : issueRequests.map((item) =>
          getIssueWithStatus(item, stableBitcoinConfirmations, stableParachainConfirmations, currentActiveBlockNumber)
        );

  return {
    isIdle:
      stableBitcoinConfirmationsIdle ||
      stableParachainConfirmationsIdle ||
      currentActiveBlockNumberIdle ||
      issueRequestsIdle,
    isLoading:
      stableBitcoinConfirmationsLoading ||
      stableParachainConfirmationsLoading ||
      currentActiveBlockNumberLoading ||
      issueRequestsLoading,
    data,
    error:
      stableBitcoinConfirmationsError ||
      stableParachainConfirmationsError ||
      currentActiveBlockNumberError ||
      issueRequestsError
  };
};

export { useIssueRequests };
