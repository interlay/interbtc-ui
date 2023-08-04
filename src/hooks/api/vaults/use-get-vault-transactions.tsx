import { IssueStatus, RedeemStatus, ReplaceRequestExt } from '@interlay/interbtc-api';
import { H256 } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { formatDateTimePrecise } from '@/common/utils/utils';
import { ACCOUNT_ID_TYPE_NAME } from '@/config/general';
import useCurrentActiveBlockNumber from '@/hooks/use-current-active-block-number';
import useStableBitcoinConfirmations from '@/hooks/use-stable-bitcoin-confirmations';
import useStableParachainConfirmations from '@/hooks/use-stable-parachain-confirmations';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import issuesFetcher, { getIssueWithStatus, ISSUES_FETCHER } from '@/services/fetchers/issues-fetcher';
import redeemsFetcher, { getRedeemWithStatus, REDEEMS_FETCHER } from '@/services/fetchers/redeems-fetcher';
import { getCurrencyEqualityCondition } from '@/utils/helpers/currencies';

import { useGetCurrencies } from '../use-get-currencies';

type TransactionStatus = 'pending' | 'cancelled' | 'completed' | 'confirmed' | 'received' | 'retried';

type TransactionTableData = {
  id: string;
  request: string;
  date: string;
  amount: string;
  status: TransactionStatus;
  // This `any` is an upstream issue - issue and redeem request data
  // hasn't been typed properly. This is a TODO, but out of scope here.
  requestData: any;
};

// TODO: Bad stuff happening here! `getIssueWithStatus` and `getRedeemWithStatus` are
// mutating the data which is why `status` is being set like this. We need to refactor
// the modal and fetchers to handle all use cases better.
const setIssueStatus = (status: IssueStatus) => {
  switch (status) {
    case IssueStatus.Completed:
      return 'completed';
    case IssueStatus.Cancelled:
    case IssueStatus.Expired:
      return 'cancelled';
    case IssueStatus.PendingWithBtcTxNotIncluded:
    case IssueStatus.PendingWithBtcTxNotFound:
    case IssueStatus.PendingWithTooFewConfirmations:
      return 'pending';
    case IssueStatus.PendingWithEnoughConfirmations:
      return 'confirmed';
    default:
      throw new Error('Invalid issue request status!');
  }
};

const setRedeemStatus = (status: RedeemStatus) => {
  switch (status) {
    case RedeemStatus.Completed:
      return 'completed';
    case RedeemStatus.PendingWithBtcTxNotFound:
      return 'pending';
    case RedeemStatus.Reimbursed:
      return 'reimbursed';
    case RedeemStatus.Retried:
      return 'retried';
    default:
      return 'received';
  }
};

// TODO: Issues/Redeems/ReplaceRequests types are missing
const parseTransactionsData = (
  issues: any,
  redeems: any,
  replaceRequests: any,
  stableBitcoinConfirmations: any,
  stableParachainConfirmations: any,
  currentActiveBlockNumber: any
) => {
  const mappedIssues = issues
    ? issues.map((issue: any) => {
        return {
          requestData: getIssueWithStatus(
            issue,
            stableBitcoinConfirmations,
            stableParachainConfirmations,
            currentActiveBlockNumber
          ),
          id: issue.id,
          request: 'Issue',
          amount: issue.execution
            ? issue.execution.amountWrapped.toBig().toString()
            : issue.request.amountWrapped.toBig().toString(),
          status: setIssueStatus(issue.status),
          date: formatDateTimePrecise(new Date(issue.request.timestamp))
        };
      })
    : undefined;

  const mappedRedeems = redeems
    ? redeems.map((redeem: any) => {
        return {
          requestData: getRedeemWithStatus(
            redeem,
            stableBitcoinConfirmations,
            stableParachainConfirmations,
            currentActiveBlockNumber
          ),
          id: redeem.id,
          request: 'Redeem',
          amount: redeem.request.requestedAmountBacking.toBig().toString(),
          status: setRedeemStatus(redeem.status),
          date: formatDateTimePrecise(new Date(redeem.request.timestamp))
        };
      })
    : undefined;

  const mappedReplaceRequests = replaceRequests
    ? replaceRequests.map((replaceRequest: any) => {
        return {
          id: replaceRequest.id,
          request: 'Replace',
          amount: '-',
          status: replaceRequest.status.isPending
            ? 'pending'
            : replaceRequest.status.isCompleted
            ? 'completed'
            : replaceRequest.status.isCancelled
            ? 'cancelled'
            : '',
          date: '-'
        };
      })
    : undefined;

  return mappedIssues && mappedRedeems && mappedReplaceRequests
    ? [...mappedIssues, ...mappedRedeems, ...mappedReplaceRequests]
    : [];
};

const useGetVaultTransactions = (
  address: string,
  collateralTokenTicker: string,
  bridgeLoaded: boolean
): TransactionTableData[] => {
  const vaultId = window.bridge?.api.createType(ACCOUNT_ID_TYPE_NAME, address);

  const { getCurrencyFromTicker, isSuccess: currenciesSuccess, error: currenciesError } = useGetCurrencies(
    bridgeLoaded
  );
  useErrorHandler(currenciesError);

  const collateralTokenCondition = currenciesSuccess
    ? getCurrencyEqualityCondition(getCurrencyFromTicker(collateralTokenTicker))
    : '';
  const { data: stableBitcoinConfirmations, error: stableBitcoinConfirmationsError } = useStableBitcoinConfirmations();
  useErrorHandler(stableBitcoinConfirmationsError);

  const { data: currentActiveBlockNumber, error: currentActiveBlockNumberError } = useCurrentActiveBlockNumber();
  useErrorHandler(currentActiveBlockNumberError);

  const {
    data: stableParachainConfirmations,
    error: stableParachainConfirmationsError
  } = useStableParachainConfirmations();
  useErrorHandler(stableParachainConfirmationsError);

  // TODO: remove the dependency on legacy issuesFetcher and redeemFetcher
  const { data: issues, error: issuesError } = useQuery<any, Error>(
    [
      ISSUES_FETCHER,
      0, // offset
      10, // limit
      `vault: {accountId_eq: "${address}", collateralToken: {${collateralTokenCondition}}}`
    ],
    issuesFetcher,
    { enabled: currenciesSuccess }
  );
  useErrorHandler(issuesError);

  const { data: redeems, error: redeemsError } = useQuery<any, Error>(
    [
      REDEEMS_FETCHER,
      0, // offset
      10, // limit
      `vault: {accountId_eq: "${address}", collateralToken: {${collateralTokenCondition}}}`
    ],
    redeemsFetcher,
    { enabled: currenciesSuccess }
  );
  useErrorHandler(redeemsError);

  // TODO: removing the generic fetcher in this instance caused a type error. This needs to be fixed.
  const { data: replaceRequests, error: replaceRequestsError } = useQuery<Map<H256, ReplaceRequestExt>, Error>(
    [GENERIC_FETCHER, 'replace', 'mapReplaceRequests', vaultId],
    genericFetcher<Map<H256, ReplaceRequestExt>>()
  );
  useErrorHandler(replaceRequestsError);

  return parseTransactionsData(
    issues,
    redeems,
    replaceRequests,
    stableBitcoinConfirmations,
    stableParachainConfirmations,
    currentActiveBlockNumber
  );
};

export { useGetVaultTransactions };
