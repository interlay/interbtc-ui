
import {
  BitcoinNetwork,
  IssueColumns,
  IndexApi,
  Configuration
} from '@interlay/interbtc-index-client';
import { Issue } from '@interlay/interbtc';

import {
  STATS_URL,
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

  // Temporary declaration pending refactor decision
  const index = new IndexApi(new Configuration({ basePath: STATS_URL }));

  return await index.getFilteredIssues({
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
