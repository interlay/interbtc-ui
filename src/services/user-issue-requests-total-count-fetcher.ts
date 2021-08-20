
// ray test touch <
import {
  IssueColumns,
  IndexApi,
  Configuration
} from '@interlay/interbtc-index-client';

import { STATS_URL } from '../constants';

const USER_ISSUE_REQUESTS_TOTAL_COUNT_FETCHER = 'user-issue-requests-total-count-fetcher';

interface Arguments {
  queryKey: [
    string,
    string
  ]
}

// TODO: should create fetchers in a granular way
const userIssueRequestsTotalCountFetcher = async ({ queryKey }: Arguments): Promise<number> => {
  const [
    _key,
    account
  ] = queryKey;

  if (_key !== USER_ISSUE_REQUESTS_TOTAL_COUNT_FETCHER) {
    throw new Error('Invalid key!');
  }

  const index = new IndexApi(new Configuration({ basePath: STATS_URL }));

  return await index.getFilteredTotalIssues({
    filterIssueColumns: [{
      column: IssueColumns.Requester,
      value: account
    }]
  });
};

export {
  USER_ISSUE_REQUESTS_TOTAL_COUNT_FETCHER
};

export default userIssueRequestsTotalCountFetcher;
// ray test touch >
