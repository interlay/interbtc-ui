import { Dispatch } from 'redux';
import { updateHeightsAction } from '../actions/general.actions';
import { StoreState } from '../types/util.types';

export default async function fetchBtcRelayAndBitcoinHeight(dispatch: Dispatch, store: StoreState): Promise<void> {
  const state = store.getState();
  const { btcRelayHeight, bitcoinHeight, polkaBtcLoaded } = state.general;
  if (!polkaBtcLoaded) return;

  try {
    const latestBtcRelayHeight = Number(await window.polkaBTC.btcRelay.getLatestBlockHeight());
    const latestBitcoinHeight = await window.polkaBTC.electrsAPI.getLatestBlockHeight();

    // update store only if there is a difference between the latest heights and current heights
    if (btcRelayHeight !== latestBtcRelayHeight || bitcoinHeight !== latestBitcoinHeight) {
      dispatch(updateHeightsAction(latestBtcRelayHeight, latestBitcoinHeight));
    }
  } catch (error) {
    console.log(error);
  }
}
