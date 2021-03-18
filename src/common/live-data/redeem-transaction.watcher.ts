
import { Dispatch } from 'redux';
import * as polkabtcStats from '@interlay/polkabtc-stats';
import {
  BtcNetworkName,
  RedeemColumns
} from '@interlay/polkabtc-stats';

import { RedeemRequest } from 'common/types/redeem.types';
import { StoreState } from 'common/types/util.types';
import * as constants from '../../constants';
import { updateAllRedeemRequestsAction } from 'common/actions/redeem.actions';
import { statsToUIRedeemRequest } from 'common/utils/utils';

async function fetchRedeemTransactions(dispatch: Dispatch, store: StoreState): Promise<void> {
  try {
    // Temporary declaration pending refactor decision
    const stats = new polkabtcStats.StatsApi(new polkabtcStats.Configuration({ basePath: constants.STATS_URL }));

    const {
      address,
      polkaBtcLoaded,
      bitcoinHeight
    } = store.getState().general;
    if (!address || !polkaBtcLoaded) return;

    const parachainHeight = await window.polkaBTC.system.getCurrentBlockNumber();
    const redeemPeriod = await window.polkaBTC.redeem.getRedeemPeriod();
    const requiredBtcConfirmations = await window.polkaBTC.btcRelay.getStableBitcoinConfirmations();

    const databaseRequests: RedeemRequest[] = (
      await stats.getFilteredRedeems(
        0, // Page 0 (i.e. first page)
        15, // 15 per page (i.e. fetch 15 latest requests)
        undefined, // Default sorting
        undefined, // Default sort order
        constants.BITCOIN_NETWORK as BtcNetworkName,
        [{ column: RedeemColumns.Requester, value: address }] // Filter by requester == address
      )
    ).data.map(statsRedeem =>
      statsToUIRedeemRequest(statsRedeem, bitcoinHeight, parachainHeight, redeemPeriod, requiredBtcConfirmations)
    );

    dispatch(updateAllRedeemRequestsAction(address, databaseRequests));
  } catch (error) {
    console.log(error.toString());
  }
}

export default fetchRedeemTransactions;
