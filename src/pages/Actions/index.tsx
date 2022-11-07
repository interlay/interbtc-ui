import { IssueStatus } from '@interlay/interbtc-api';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import { ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL } from '@/config/parachain';
import { useSubstrateSecureState } from '@/lib/substrate';
import useIssueRequests from '@/services/hooks/use-issue-requests';

const FAKE_UNLIMITED_NUMBER = 1e9;

const Actions = (): JSX.Element => {
  const { selectedAccount } = useSubstrateSecureState();

  const {
    isIdle: issueRequestsIdle,
    isLoading: issueRequestsLoading,
    data: issueRequests,
    error: issueRequestsError
  } = useIssueRequests(
    0,
    FAKE_UNLIMITED_NUMBER,
    `userParachainAddress_eq: "${selectedAccount?.address ?? ''}"`,
    ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL
  );
  useErrorHandler(issueRequestsError);

  if (issueRequestsIdle || issueRequestsLoading) {
    return <PrimaryColorEllipsisLoader />;
  }
  if (issueRequests === undefined) {
    throw new Error('Something went wrong!');
  }

  // ray test touch <
  const actionableIssueRequests = issueRequests.filter((item) => {
    switch (item.status) {
      case IssueStatus.Cancelled:
      case IssueStatus.Expired: {
        return item.backingPayment.btcTxId ? true : false;
      }
      case IssueStatus.PendingWithEnoughConfirmations:
        return true;
      default:
        return false;
    }
  });
  console.log('ray : ***** test => ', actionableIssueRequests);
  // ray test touch >

  return <>Actions</>;
};

export default withErrorBoundary(Actions, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
