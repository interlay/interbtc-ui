
import {
  BitcoinNetwork,
  RedeemColumns,
  IndexApi,
  Configuration
} from '@interlay/interbtc-index-client';
import { Redeem } from '@interlay/interbtc';

import {
  STATS_URL,
  BITCOIN_NETWORK
} from '../constants';

const USER_REDEEM_REQUESTS_FETCHER = 'user-redeem-requests-fetcher';

interface Arguments {
  queryKey: [
    string,
    string,
    number,
    number
  ]
}

const userRedeemRequestsFetcher = async ({ queryKey }: Arguments): Promise<Array<Redeem>> => {
  const [
    _key,
    account,
    page,
    limit
  ] = queryKey;

  if (_key !== USER_REDEEM_REQUESTS_FETCHER) {
    throw new Error('Invalid key!');
  }

  // Temporary declaration pending refactor decision
  const index = new IndexApi(new Configuration({ basePath: STATS_URL }));

  const userRedeemRequests = await index.getFilteredRedeems({
    page,
    perPage: limit,
    network: BITCOIN_NETWORK as BitcoinNetwork,
    filterRedeemColumns: [{
      column: RedeemColumns.Requester,
      value: account
    }] // Filter by requester == account
  });

  return userRedeemRequests;
};

export {
  USER_REDEEM_REQUESTS_FETCHER
};

export default userRedeemRequestsFetcher;
