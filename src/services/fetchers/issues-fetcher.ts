import { atomicToBaseAmount, IssueStatus, newMonetaryAmount } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinAmount } from '@interlay/monetary-js';

import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import graphqlFetcher, { GRAPHQL_FETCHER } from '@/services/fetchers/graphql-fetcher';
import getTxDetailsForRequest from '@/services/fetchers/request-btctx-fetcher';
import issuesQuery from '@/services/queries/issues-query';

type IssuesFetcherParams = [queryKey: string, offset: number, limit: number, where?: string];

const ISSUES_FETCHER = 'issues-fetcher';

// TODO: should type properly (`Relay`)
function decodeIssueValues(issue: any): any {
  issue.request.amountWrapped = new BitcoinAmount(atomicToBaseAmount(issue.request.amountWrapped, Bitcoin));
  issue.request.bridgeFeeWrapped = new BitcoinAmount(atomicToBaseAmount(issue.request.bridgeFeeWrapped, Bitcoin));
  issue.griefingCollateral = newMonetaryAmount(issue.griefingCollateral, RELAY_CHAIN_NATIVE_TOKEN);
  if (issue.execution) {
    issue.execution.amountWrapped = new BitcoinAmount(atomicToBaseAmount(issue.execution.amountWrapped, Bitcoin));
    issue.execution.bridgeFeeWrapped = new BitcoinAmount(atomicToBaseAmount(issue.execution.bridgeFeeWrapped, Bitcoin));
  }

  return issue;
}

// TODO: should type properly (`Relay`)
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const issuesFetcher = async ({ queryKey }: any): Promise<Array<any>> => {
  const [key, offset, limit, where] = queryKey as IssuesFetcherParams;

  if (key !== ISSUES_FETCHER) throw new Error('Invalid key!');

  // TODO: should type properly (`Relay`)
  const issuesData = await graphqlFetcher<Array<any>>()({
    queryKey: [
      GRAPHQL_FETCHER,
      issuesQuery(where),
      {
        limit,
        offset
      }
    ]
  });

  // TODO: should type properly (`Relay`)
  const issues = issuesData?.data?.issues || [];

  return await Promise.all(
    issues.map(async (issue) => {
      issue = decodeIssueValues(issue);
      issue.backingPayment = await getTxDetailsForRequest(
        window.bridge.electrsAPI,
        issue.id,
        issue.vaultBackingAddress
      );
      return issue;
    })
  );
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
    issue.backingPayment.includedAtParachainActiveBlock === undefined ||
    issue.backingPayment.includedAtParachainActiveBlock + stableParachainConfirmations > parachainActiveHeight
  ) {
    issue.status = IssueStatus.PendingWithTooFewConfirmations;
  } else {
    issue.status = IssueStatus.PendingWithEnoughConfirmations;
  }

  return issue;
}

export { getIssueWithStatus, ISSUES_FETCHER };

export type { IssuesFetcherParams };

export default issuesFetcher;
