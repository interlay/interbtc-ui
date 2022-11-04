import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import { ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL } from '@/config/parachain';
import { useSubstrateSecureState } from '@/lib/substrate';
import useIssueRequests from '@/services/hooks/use-issue-requests';

const Actions = (): JSX.Element => {
  const { selectedAccount } = useSubstrateSecureState();

  const {
    isIdle: issueRequestsIdle,
    isLoading: issueRequestsLoading,
    data: issueRequests,
    error: issueRequestsError
  } = useIssueRequests(
    0,
    0,
    `userParachainAddress_eq: "${selectedAccount?.address ?? ''}"`,
    ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL
  );
  useErrorHandler(issueRequestsError);

  if (issueRequestsIdle || issueRequestsLoading) {
    return <PrimaryColorEllipsisLoader />;
  }
  // ray test touch <
  console.log('ray : ***** issueRequests => ', issueRequests);
  // ray test touch >

  return <>Actions</>;
};

export default withErrorBoundary(Actions, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
