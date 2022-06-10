import { useParams } from 'react-router-dom';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from 'react-query';

import ErrorFallback from 'components/ErrorFallback';
import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import { URL_PARAMETERS } from 'utils/constants/links';
import issuesFetcher, { ISSUES_FETCHER } from 'services/fetchers/issues-fetcher';

// http://localhost:3000/transaction/issue/0xfd6d53d8df584d675fe2322ccb126754d6c6d249878f0a2c9526607458714f76
const IssueTransaction = (): JSX.Element => {
  const { [URL_PARAMETERS.TRANSACTION_HASH]: transactionHash } = useParams<Record<string, string>>();

  const {
    isIdle: issueIdle,
    isLoading: issueLoading,
    data: issue,
    error: issueError
    // TODO: should type properly (`Relay`)
  } = useQuery<any, Error>(
    [
      ISSUES_FETCHER,
      0, // offset
      1, // limit
      `id_eq: "${transactionHash}"` // `WHERE` condition
    ],
    issuesFetcher
  );
  useErrorHandler(issueError);

  if (issueIdle || issueLoading) {
    return <PrimaryColorEllipsisLoader />;
  }

  console.log('[IssueTransaction] issue => ', issue);

  return <>IssueTransaction {transactionHash}</>;
};

export default withErrorBoundary(IssueTransaction, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
