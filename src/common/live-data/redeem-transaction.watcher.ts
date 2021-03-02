import { Dispatch } from 'redux';
import { RedeemRequest } from '../types/redeem.types';
import { StoreState } from '../types/util.types';
import * as constants from '../../constants';
import * as polkabtcStats from '@interlay/polkabtc-stats';
import { updateAllRedeemRequestsAction } from '../actions/redeem.actions';
import { statsToUIRedeemRequest } from '../utils/utils';
import { BtcNetworkName, RedeemColumns } from '@interlay/polkabtc-stats';

export default async function fetchRedeemTransactions(dispatch: Dispatch, store: StoreState): Promise<void> {
  try {
    // temp declaration pending refactor decision
    const stats = new polkabtcStats.StatsApi(new polkabtcStats.Configuration({ basePath: constants.STATS_URL }));

    const { address, polkaBtcLoaded, bitcoinHeight } = store.getState().general;
    if (!address || !polkaBtcLoaded) return;

    const parachainHeight = await window.polkaBTC.system.getCurrentBlockNumber();
    const redeemPeriod = await window.polkaBTC.redeem.getRedeemPeriod();
    const requiredBtcConfirmations = await window.polkaBTC.btcRelay.getStableBitcoinConfirmations();

    const databaseRequests: RedeemRequest[] = (
      await stats.getFilteredRedeems(
        0, // page 0 (i.e. first page)
        15, // 15 per page (i.e. fetch 15 latest requests)
        undefined, // default sorting
        undefined, // default sort order
                constants.BITCOIN_NETWORK as BtcNetworkName,
                [{ column: RedeemColumns.Requester, value: address }] // filter by requester==address
      )
    ).data.map(statsRedeem =>
      statsToUIRedeemRequest(statsRedeem, bitcoinHeight, parachainHeight, redeemPeriod, requiredBtcConfirmations)
    );

    dispatch(updateAllRedeemRequestsAction(address, databaseRequests));
  } catch (error) {
    console.log(error.toString());
  }
}
