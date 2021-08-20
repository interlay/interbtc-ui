
// ray test touch <
import {
  RedeemColumns,
  IndexApi,
  Configuration
} from '@interlay/interbtc-index-client';

import { STATS_URL } from '../constants';

const USER_REDEEM_REQUESTS_TOTAL_COUNT_FETCHER = 'user-redeem-requests-total-count-fetcher';

interface Arguments {
  queryKey: [
    string,
    string
  ]
}

const userRedeemRequestsTotalCountFetcher = async ({ queryKey }: Arguments): Promise<number> => {
  const [
    _key,
    account
  ] = queryKey;

  if (_key !== USER_REDEEM_REQUESTS_TOTAL_COUNT_FETCHER) {
    throw new Error('Invalid key!');
  }

  const index = new IndexApi(new Configuration({ basePath: STATS_URL }));

  return await index.getFilteredTotalRedeems({
    filterRedeemColumns: [{
      column: RedeemColumns.Requester,
      value: account
    }]
  });
};

export {
  USER_REDEEM_REQUESTS_TOTAL_COUNT_FETCHER
};

export default userRedeemRequestsTotalCountFetcher;
// ray test touch >
