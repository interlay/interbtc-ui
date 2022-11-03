import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from 'react-query';

import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import { ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL } from '@/config/parachain';
import { useSubstrateSecureState } from '@/lib/substrate';
import issuesFetcher, { getIssueWithStatus, ISSUES_FETCHER } from '@/services/fetchers/issues-fetcher';
import useCurrentActiveBlockNumber from '@/services/hooks/use-current-active-block-number';
import useStableBitcoinConfirmations from '@/services/hooks/use-stable-bitcoin-confirmations';
import useStableParachainConfirmations from '@/services/hooks/use-stable-parachain-confirmations';

const Actions = (): JSX.Element => {
  const { selectedAccount } = useSubstrateSecureState();

  // ray test touch <
  const {
    isIdle: stableBitcoinConfirmationsIdle,
    isLoading: stableBitcoinConfirmationsLoading,
    data: stableBitcoinConfirmations,
    error: stableBitcoinConfirmationsError
  } = useStableBitcoinConfirmations();
  useErrorHandler(stableBitcoinConfirmationsError);

  const {
    isIdle: stableParachainConfirmationsIdle,
    isLoading: stableParachainConfirmationsLoading,
    data: stableParachainConfirmations,
    error: stableParachainConfirmationsError
  } = useStableParachainConfirmations();
  useErrorHandler(stableParachainConfirmationsError);

  const {
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber,
    error: currentActiveBlockNumberError
  } = useCurrentActiveBlockNumber();
  useErrorHandler(currentActiveBlockNumberError);
  // ray test touch >

  const {
    isIdle: issueRequestsIdle,
    isLoading: issueRequestsLoading,
    data: issueRequests,
    error: issueRequestsError
    // TODO: should type properly (`Relay`)
  } = useQuery<any, Error>(
    [
      ISSUES_FETCHER,
      0, // offset
      0, // limit
      `userParachainAddress_eq: "${selectedAccount?.address ?? ''}"` // `WHERE` condition
    ],
    issuesFetcher,
    {
      refetchInterval: ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL
    }
  );
  useErrorHandler(issueRequestsError);

  // ray test touch <
  const data =
    issueRequests === undefined ||
    stableBitcoinConfirmations === undefined ||
    stableParachainConfirmations === undefined ||
    currentActiveBlockNumber === undefined
      ? []
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

  if (
    stableBitcoinConfirmationsIdle ||
    stableBitcoinConfirmationsLoading ||
    stableParachainConfirmationsIdle ||
    stableParachainConfirmationsLoading ||
    currentActiveBlockNumberIdle ||
    currentActiveBlockNumberLoading ||
    issueRequestsIdle ||
    issueRequestsLoading
  ) {
    return <PrimaryColorEllipsisLoader />;
  }
  console.log('ray : ***** data => ', data);
  // ray test touch >

  return <>Actions</>;
};

export default withErrorBoundary(Actions, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
