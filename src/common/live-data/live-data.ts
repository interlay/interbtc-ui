import { Dispatch } from 'redux';

import fetchBtcRelayAndBitcoinHeight from './block-height-watcher';
import fetchTotals from './totals-watcher';
import { StoreState } from 'common/types/util.types';

// TODO: should use web sockets instead of infinite times of fetch
function startFetchingLiveData(dispatch: Dispatch, store: StoreState): void {
  if (window.isFetchingActive) return;
  window.isFetchingActive = true;

  // Fetch btc-relay height and bitcoin height
  fetchBtcRelayAndBitcoinHeight(dispatch, store);
  window.setInterval(() => fetchBtcRelayAndBitcoinHeight(dispatch, store), 60000);

  // Fetch totals
  fetchTotals(dispatch, store);
  window.setInterval(() => fetchTotals(dispatch, store), 60000);
}

export default startFetchingLiveData;
