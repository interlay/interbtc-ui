
// ray test touch <
import {
  BitcoinNetwork,
  IssueColumns
} from '@interlay/interbtc-index-client';
import { Issue } from '@interlay/interbtc-api';

import {
  BITCOIN_NETWORK
} from '../constants';

const USER_ISSUE_REQUESTS_FETCHER = 'user-issue-requests-fetcher';

interface Arguments {
  queryKey: [
    string,
    string,
    number,
    number
  ]
}

const userIssueRequestsFetcher = async ({ queryKey }: Arguments): Promise<Array<Issue>> => {
  const [
    _key,
    account,
    page,
    limit
  ] = queryKey;

  if (_key !== USER_ISSUE_REQUESTS_FETCHER) {
    throw new Error('Invalid key!');
  }

  return await window.bridge.interBtcIndex.getFilteredIssues({
    page,
    perPage: limit,
    network: BITCOIN_NETWORK as BitcoinNetwork | undefined,
    filterIssueColumns: [{
      column: IssueColumns.Requester,
      value: account
    }] // Filter by requester == account
  });
};

export {
  USER_ISSUE_REQUESTS_FETCHER
};

export default userIssueRequestsFetcher;
// ray test touch >
