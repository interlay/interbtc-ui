
// ray test touch <
import {
  BitcoinNetwork,
  RedeemColumns
} from '@interlay/interbtc-index-client';
import { Redeem } from '@interlay/interbtc-api';

import {
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

  return await window.bridge.interBtcIndex.getFilteredRedeems({
    page,
    perPage: limit,
    network: BITCOIN_NETWORK as BitcoinNetwork,
    filterRedeemColumns: [{
      column: RedeemColumns.Requester,
      value: account
    }] // Filter by requester == account
  });
};

export {
  USER_REDEEM_REQUESTS_FETCHER
};

export default userRedeemRequestsFetcher;
// ray test touch >
