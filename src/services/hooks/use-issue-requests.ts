// ray test touch <
import { useQuery } from 'react-query';

import issuesFetcher, { getIssueWithStatus, ISSUES_FETCHER } from '@/services/fetchers/issues-fetcher';
import useCurrentActiveBlockNumber from '@/services/hooks/use-current-active-block-number';
import useStableBitcoinConfirmations from '@/services/hooks/use-stable-bitcoin-confirmations';
import useStableParachainConfirmations from '@/services/hooks/use-stable-parachain-confirmations';

const useIssueRequests = (
  accountAddress: string,
  offset: number,
  limit: number,
  refetchInterval?: number | false | undefined
): {
  isIdle: boolean;
  isLoading: boolean;
  data: any; // TODO: should type properly (`Relay`)
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
    [
      ISSUES_FETCHER,
      offset, // offset
      limit, // limit
      `userParachainAddress_eq: "${accountAddress}"` // `WHERE` condition
    ],
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
// ray test touch >
