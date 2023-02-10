import { IssueStatus } from '@interlay/interbtc-api';
import * as React from 'react';
import { useQuery } from 'react-query';

import { ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL } from '@/config/parachain';
import { useSubstrateSecureState } from '@/lib/substrate';
import issuesFetcher, { getIssueWithStatus, ISSUES_FETCHER } from '@/services/fetchers/issues-fetcher';
import useCurrentActiveBlockNumber from '@/services/hooks/use-current-active-block-number';
import useStableBitcoinConfirmations from '@/services/hooks/use-stable-bitcoin-confirmations';
import useStableParachainConfirmations from '@/services/hooks/use-stable-parachain-confirmations';
import { IssueRequest, IssueRequestWithStatusDecoded } from '@/types/issues.d';

const getManualIssueRequests = (
  issueRequests: Array<IssueRequestWithStatusDecoded>
): Array<IssueRequestWithStatusDecoded> => {
  return issueRequests.filter((item) => {
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
};

const useIssueRequests = (
  offset: number,
  limit: number,
  whereCondition: string | undefined,
  refetchInterval?: number | false | undefined
): {
  isIdle: boolean;
  isLoading: boolean;
  data: Array<IssueRequestWithStatusDecoded> | undefined;
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
  } = useCurrentActiveBlockNumber(refetchInterval);

  const {
    isIdle: issueRequestsIdle,
    isLoading: issueRequestsLoading,
    data: issueRequests,
    error: issueRequestsError
  } = useQuery<Array<IssueRequest>, Error>(
    whereCondition === undefined ? [ISSUES_FETCHER, offset, limit] : [ISSUES_FETCHER, offset, limit, whereCondition],
    issuesFetcher,
    {
      refetchInterval
    }
  );

  const data: Array<IssueRequestWithStatusDecoded> | undefined =
    issueRequests === undefined ||
    stableBitcoinConfirmations === undefined ||
    stableParachainConfirmations === undefined ||
    currentActiveBlockNumber === undefined
      ? undefined
      : issueRequests.map((item) =>
          getIssueWithStatus(item, stableBitcoinConfirmations, stableParachainConfirmations, currentActiveBlockNumber)
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

const FAKE_UNLIMITED_NUMBER = 2147483647; // TODO: a temporary solution for now

const useManualIssueRequests = (): {
  isIdle: boolean;
  isLoading: boolean;
  data: Array<IssueRequestWithStatusDecoded> | undefined;
  error: Error | null;
} => {
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

  const manualIssueRequests = React.useMemo(() => {
    if (issueRequests === undefined) return undefined;

    return getManualIssueRequests(issueRequests);
  }, [issueRequests]);

  return {
    isIdle: issueRequestsIdle,
    isLoading: issueRequestsLoading,
    data: manualIssueRequests,
    error: issueRequestsError
  };
};

export { useIssueRequests, useManualIssueRequests };
