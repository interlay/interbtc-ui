import { useParams } from 'react-router-dom';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from 'react-query';

import IssueUI from 'components/IssueUI';
import ErrorFallback from 'components/ErrorFallback';
import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import { URL_PARAMETERS } from 'utils/constants/links';
import useStableBitcoinConfirmations from 'services/hooks/use-stable-bitcoin-confirmations';
import useStableParachainConfirmations from 'services/hooks/use-stable-parachain-confirmations';
import useCurrentActiveBlockNumber from 'services/hooks/use-current-active-block-number';
import issuesFetcher, { ISSUES_FETCHER, getIssueWithStatus } from 'services/fetchers/issues-fetcher';

// MEMO: /tx/issue/0xfd6d53d8df584d675fe2322ccb126754d6c6d249878f0a2c9526607458714f76
const IssueTX = (): JSX.Element => {
  const { [URL_PARAMETERS.TRANSACTION_HASH]: txHash } = useParams<Record<string, string>>();

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

  const {
    isIdle: issuesIdle,
    isLoading: issuesLoading,
    data: issues,
    error: issuesError
    // TODO: should type properly (`Relay`)
  } = useQuery<any, Error>(
    [
      ISSUES_FETCHER,
      0, // offset
      1, // limit
      `id_eq: "${txHash}"` // `WHERE` condition
    ],
    issuesFetcher
  );
  useErrorHandler(issuesError);

  if (
    issuesIdle ||
    issuesLoading ||
    stableBitcoinConfirmationsIdle ||
    stableBitcoinConfirmationsLoading ||
    stableParachainConfirmationsIdle ||
    stableParachainConfirmationsLoading ||
    currentActiveBlockNumberIdle ||
    currentActiveBlockNumberLoading
  ) {
    return <PrimaryColorEllipsisLoader />;
  }
  if (
    issues === undefined ||
    stableBitcoinConfirmations === undefined ||
    stableParachainConfirmations === undefined ||
    currentActiveBlockNumber === undefined
  ) {
    throw new Error('Something went wrong!');
  }

  const issue = getIssueWithStatus(
    issues[0],
    stableBitcoinConfirmations,
    stableParachainConfirmations,
    currentActiveBlockNumber
  );

  return (
    <IssueUI issue={issue} />
  );
};

export default withErrorBoundary(IssueTX, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
