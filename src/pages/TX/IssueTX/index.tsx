import { useParams } from 'react-router-dom';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from 'react-query';
// ray test touch <
import { useSelector } from 'react-redux';

import IssueRequestModal from 'pages/Transactions/IssueRequestsTable/IssueRequestModal';
// ray test touch >
import ErrorFallback from 'components/ErrorFallback';
import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import { URL_PARAMETERS } from 'utils/constants/links';
// ray test touch <
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import useStableBitcoinConfirmations from 'services/hooks/use-stable-bitcoin-confirmations';
// ray test touch >
import issuesFetcher, { ISSUES_FETCHER, getIssueWithStatus } from 'services/fetchers/issues-fetcher';
// ray test touch <
import { StoreType } from 'common/types/util.types';
// ray test touch >

// http://localhost:3000/tx/issue/0xfd6d53d8df584d675fe2322ccb126754d6c6d249878f0a2c9526607458714f76
const IssueTX = (): JSX.Element => {
  const { [URL_PARAMETERS.TRANSACTION_HASH]: transactionHash } = useParams<Record<string, string>>();

  // ray test touch <
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

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
  } = useQuery<number, Error>(
    [GENERIC_FETCHER, 'btcRelay', 'getStableParachainConfirmations'],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(stableParachainConfirmationsError);

  const {
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber,
    error: currentActiveBlockNumberError
  } = useQuery<number, Error>([GENERIC_FETCHER, 'system', 'getCurrentActiveBlockNumber'], genericFetcher<number>(), {
    enabled: !!bridgeLoaded
  });
  useErrorHandler(currentActiveBlockNumberError);
  // ray test touch >

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
      `id_eq: "${transactionHash}"` // `WHERE` condition
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
  // ray test touch <
  if (
    stableBitcoinConfirmations === undefined ||
    stableParachainConfirmations === undefined ||
    currentActiveBlockNumber === undefined
  ) {
    throw new Error('Something went wrong!');
  }

  console.log('[IssueTX] issues => ', issues);

  const issue = getIssueWithStatus(
    issues[0],
    stableBitcoinConfirmations,
    stableParachainConfirmations,
    currentActiveBlockNumber
  );
  // ray test touch >

  // ray test touch <
  return (
    <IssueRequestModal
      open
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClose={() => {}}
      request={issue}
    />
  );
  // ray test touch >
};

export default withErrorBoundary(IssueTX, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
