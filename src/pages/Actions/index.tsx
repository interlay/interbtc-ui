// ray test touch <
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from 'react-query';

import ErrorFallback from '@/components/ErrorFallback';
import { ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL } from '@/config/parachain';
import { useSubstrateSecureState } from '@/lib/substrate';
import issuesFetcher, {
  // getIssueWithStatus,
  ISSUES_FETCHER
} from '@/services/fetchers/issues-fetcher';
// ray test touch >

const Actions = (): JSX.Element => {
  // ray test touch <
  const { selectedAccount } = useSubstrateSecureState();
  const {
    // isIdle: issueRequestsIdle,
    // isLoading: issueRequestsLoading,
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
