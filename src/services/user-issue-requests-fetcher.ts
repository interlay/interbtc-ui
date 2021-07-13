
import * as interbtcIndex from '@interlay/interbtc-index-client';
import {
  BitcoinNetwork,
  IssueColumns
} from '@interlay/interbtc-index-client';
import { Issue } from '@interlay/interbtc';

import * as constants from '../constants';

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

  // Temporary declaration pending refactor decision
  const index = new interbtcIndex.IndexApi(new interbtcIndex.Configuration({ basePath: constants.STATS_URL }));

  const userIssueRequests = await index.getFilteredIssues({
    page,
    perPage: limit,
    network: constants.BITCOIN_NETWORK as BitcoinNetwork | undefined,
    filterIssueColumns: [{
      column: IssueColumns.Requester,
      value: account
    }] // Filter by requester == account
  });

  return userIssueRequests;
};

export {
  USER_ISSUE_REQUESTS_FETCHER
};

export default userIssueRequestsFetcher;
