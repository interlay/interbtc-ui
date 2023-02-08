import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';

import ErrorFallback from '@/legacy-components/ErrorFallback';
import IssueUI from '@/legacy-components/IssueUI';
import PrimaryColorEllipsisLoader from '@/legacy-components/PrimaryColorEllipsisLoader';
import { useIssueRequests } from '@/services/hooks/issue-requests';
import { URL_PARAMETERS } from '@/utils/constants/links';

// MEMO: /tx/issue/0xfd6d53d8df584d675fe2322ccb126754d6c6d249878f0a2c9526607458714f76
const IssueTX = (): JSX.Element => {
  const { [URL_PARAMETERS.TRANSACTION_HASH]: txHash } = useParams<Record<string, string>>();

  const {
    isIdle: issueRequestsIdle,
    isLoading: issueRequestsLoading,
    data: issueRequests,
    error: issueRequestsError
  } = useIssueRequests(0, 1, `id_eq: "${txHash}"`);
  useErrorHandler(issueRequestsError);

  if (issueRequestsIdle || issueRequestsLoading) {
    return <PrimaryColorEllipsisLoader />;
  }
  if (issueRequests === undefined) {
    throw new Error('Something went wrong!');
  }

  return <IssueUI issue={issueRequests[0]} />;
};

export default withErrorBoundary(IssueTX, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
