import { useQuery } from 'react-query';

import issuesFetcher, { getIssueWithStatus, ISSUES_FETCHER } from '@/services/fetchers/issues-fetcher';
import useCurrentActiveBlockNumber from '@/services/hooks/use-current-active-block-number';
import useStableBitcoinConfirmations from '@/services/hooks/use-stable-bitcoin-confirmations';
import useStableParachainConfirmations from '@/services/hooks/use-stable-parachain-confirmations';

const useIssueRequests = (
  offset: number,
  limit: number,
  // ray test touch <
  whereCondition: string | undefined,
  // ray test touch >
  refetchInterval?: number | false | undefined
): {
  isIdle: boolean;
  isLoading: boolean;
  // ray test touch <
  data: any | undefined; // TODO: should type properly (`Relay`)
  // ray test touch >
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
    // TODO: should type properly (`Relay`)
  } = useQuery<any, Error>(
    // ray test touch <
    whereCondition === undefined ? [ISSUES_FETCHER, offset, limit] : [ISSUES_FETCHER, offset, limit, whereCondition],
    // ray test touch >
    issuesFetcher,
    {
      refetchInterval
    }
  );

  const data =
    issueRequests === undefined ||
    stableBitcoinConfirmations === undefined ||
    stableParachainConfirmations === undefined ||
    currentActiveBlockNumber === undefined
      ? undefined
      : issueRequests.map(
          // TODO: should type properly (`Relay`)
          (issueRequest: any) =>
            getIssueWithStatus(
              issueRequest,
              stableBitcoinConfirmations,
              stableParachainConfirmations,
              currentActiveBlockNumber
            )
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

export default useIssueRequests;
