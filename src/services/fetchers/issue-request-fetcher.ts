import issueRequestsQuery from 'services/queries/issueRequests';
import graphqlFetcher, { GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';
import { BitcoinAmount, KusamaAmount } from '@interlay/monetary-js';
import { IssueStatus } from '@interlay/interbtc-api';
import { btcAddressFromEventToString } from 'common/utils/utils';
import { BITCOIN_NETWORK } from '../../constants';
import getTxDetailsForRequest from 'services/fetchers/request-btctx-fetcher';

const ISSUE_FETCHER = 'issue-fetcher';

// TODO: type graphql query return
function decodeIssueValues(issue: any): any {
  issue.request.amountWrapped = BitcoinAmount.from.Satoshi(issue.request.amountWrapped);
  issue.bridgeFee = BitcoinAmount.from.Satoshi(issue.bridgeFee);
  issue.griefingCollateral = KusamaAmount.from.Planck(issue.griefingCollateral);
  if (issue.execution) {
    issue.execution.amountWrapped =
      BitcoinAmount.from.Satoshi(issue.execution.amountWrapped);
  }
  issue.vaultBackingAddress = btcAddressFromEventToString(issue.vaultBackingAddress, BITCOIN_NETWORK);
  return issue;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const issueFetcher = async ({ queryKey }: any): Promise<Array<any>> => {
  const [key, offset, limit, stableBtcConfirmations, where] = queryKey as IssueFetcherParams;
  if (key !== ISSUE_FETCHER) throw new Error('Invalid key!');
  const issuesData = await graphqlFetcher<Array<any>>()({ queryKey: [
    GRAPHQL_FETCHER,
    issueRequestsQuery(where),
    {
      limit,
      offset
    }
  ] });

  // TODO: type graphql returns
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

// TODO: get graphql types to audo-decode enum? Can e.g. Relay do that?
export function setIssueStatus(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  issue: any,
  stableBtcConfirmations: number,
  stableParachainConfirmations: number,
  parachainActiveHeight: number
): any {
  if (issue.status !== 'Pending') {
    // ideally this would be auto-decoded, for now set by hand
    if (issue.status === 'Expired') issue.status = IssueStatus.Expired;
    else if (issue.status === 'Completed') issue.status = IssueStatus.Completed;
    else if (issue.status === 'Cancelled') issue.status = IssueStatus.Cancelled;
    else if (issue.status === 'RequestedRefund') issue.status = IssueStatus.RequestedRefund;
    return issue;
  }
  if (!issue.backingPayment || !issue.backingPayment.btcTxId) {
    issue.status = IssueStatus.PendingWithBtcTxNotFound;
  } else if (!issue.backingPayment.confirmations) {
    issue.status = IssueStatus.PendingWithBtcTxNotIncluded;
  } else if (
    issue.backingPayment.confirmations < stableBtcConfirmations ||
    issue.backingPayment.confirmedAtParachainActiveBlock === undefined ||
    issue.backingPayment.confirmedAtParachainActiveBlock + stableParachainConfirmations < parachainActiveHeight
  ) {
    issue.status = IssueStatus.PendingWithTooFewConfirmations;
  } else {
    issue.status = IssueStatus.PendingWithEnoughConfirmations;
  }
  return issue;
}

export type IssueFetcherParams = [
  queryKey: string,
  offset: number,
  limit: number,
  stableBtcConfirmations: number,
  where?: string
]

export {
  ISSUE_FETCHER
};

export default issueFetcher;
