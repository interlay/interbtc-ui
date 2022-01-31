import { BitcoinAmount } from '@interlay/monetary-js';
import { newMonetaryAmount, IssueStatus } from '@interlay/interbtc-api';

import { COLLATERAL_TOKEN } from 'config/relay-chains';
import issueRequestsQuery from 'services/queries/issue-requests-query';
import graphqlFetcher, { GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';
import getTxDetailsForRequest from 'services/fetchers/request-btctx-fetcher';

const ISSUE_FETCHER = 'issue-fetcher';

// TODO: should type properly (`Relay`)
function decodeIssueValues(issue: any): any {
  issue.request.amountWrapped = BitcoinAmount.from.Satoshi(issue.request.amountWrapped);
  issue.request.bridgeFeeWrapped = BitcoinAmount.from.Satoshi(issue.request.bridgeFeeWrapped);
  issue.griefingCollateral = newMonetaryAmount(issue.griefingCollateral, COLLATERAL_TOKEN);
  if (issue.execution) {
    issue.execution.amountWrapped = BitcoinAmount.from.Satoshi(issue.execution.amountWrapped);
    issue.execution.bridgeFeeWrapped = BitcoinAmount.from.Satoshi(issue.execution.bridgeFeeWrapped);
  }

  return issue;
}

// TODO: should type properly (`Relay`)
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const issueFetcher = async ({ queryKey }: any): Promise<Array<any>> => {
  const [
    key,
    offset,
    limit,
    stableBtcConfirmations,
    where
  ] = queryKey as IssueFetcherParams;

  if (key !== ISSUE_FETCHER) throw new Error('Invalid key!');

  // TODO: should type properly (`Relay`)
  const issuesData = await graphqlFetcher<Array<any>>()({
    queryKey: [
      GRAPHQL_FETCHER,
      issueRequestsQuery(where),
      {
        limit,
        offset
      }
    ]
  });

  // TODO: should type properly (`Relay`)
  const issues = issuesData?.data?.issues || [];

  return await Promise.all(issues.map(async issue => {
    issue = decodeIssueValues(issue);
    issue.backingPayment = await getTxDetailsForRequest(
      window.bridge.interBtcApi.electrsAPI,
      issue.id,
      issue.vaultBackingAddress,
      stableBtcConfirmations
    );
    return issue;
  }));
};

// TODO: should type properly (`Relay`)
function getIssueWithStatus(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  issue: any,
  stableBtcConfirmations: number,
  stableParachainConfirmations: number,
  parachainActiveHeight: number
): any {
  stableParachainConfirmations = Number(stableParachainConfirmations);
  stableBtcConfirmations = Number(stableBtcConfirmations);
  parachainActiveHeight = Number(parachainActiveHeight);

  if (issue.status !== 'Pending') {
    // ideally this would be auto-decoded, for now set by hand
    if (issue.status === 'Expired') {
      issue.status = IssueStatus.Expired;
    } else if (issue.status === 'Completed') {
      issue.status = IssueStatus.Completed;
    } else if (issue.status === 'Cancelled') {
      issue.status = IssueStatus.Cancelled;
    } else if (issue.status === 'RequestedRefund') {
      issue.status = IssueStatus.RequestedRefund;
    }

    return issue;
  }

  if (!issue.backingPayment || !issue.backingPayment.btcTxId) {
    issue.status = IssueStatus.PendingWithBtcTxNotFound;
  } else if (!issue.backingPayment.confirmations) {
    issue.status = IssueStatus.PendingWithBtcTxNotIncluded;
  } else if (
    issue.backingPayment.confirmations < stableBtcConfirmations ||
    issue.backingPayment.confirmedAtParachainActiveBlock === undefined ||
    issue.backingPayment.confirmedAtParachainActiveBlock + stableParachainConfirmations > parachainActiveHeight
  ) {
    issue.status = IssueStatus.PendingWithTooFewConfirmations;
  } else {
    issue.status = IssueStatus.PendingWithEnoughConfirmations;
  }

  return issue;
}

type IssueFetcherParams = [
  queryKey: string,
  offset: number,
  limit: number,
  stableBtcConfirmations: number,
  where?: string
]

export {
  getIssueWithStatus,
  ISSUE_FETCHER
};

export type {
  IssueFetcherParams
};

export default issueFetcher;
