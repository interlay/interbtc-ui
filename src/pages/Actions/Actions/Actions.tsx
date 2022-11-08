import { IssueStatus } from '@interlay/interbtc-api';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import { ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL } from '@/config/parachain';
import { useSubstrateSecureState } from '@/lib/substrate';
import MainContainer from '@/parts/MainContainer';
import useIssueRequests from '@/services/hooks/use-issue-requests';
import { IssueRequestWithStatusDecoded } from '@/types/issues';

import { ActionsTable } from './components/ActionsTable';

const FAKE_UNLIMITED_NUMBER = 2147483647; // TODO: a temporary solution for now

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

  // ray test touch <
  const handleVisitIssueRequestClick = (issueRequest: IssueRequestWithStatusDecoded) => {
    console.log('ray : ***** issueRequest => ', issueRequest);
  };
  // ray test touch >

  return (
    <MainContainer>
      <ActionsTable data={actionableIssueRequests} onClickVisitIssueRequest={handleVisitIssueRequestClick} />
    </MainContainer>
  );
};

const ActionsWithErrorBoundary = withErrorBoundary(Actions, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});

export { ActionsWithErrorBoundary as Actions };
