import {
  displayBtcAmount,
  displayDotAmount
} from 'common/utils/utils';
import { Dispatch } from 'redux';
import { updateTotalsAction } from '../actions/general.actions';
import { StoreState } from '../types/util.types';

export default async function fetchTotals(dispatch: Dispatch, store: StoreState): Promise<void> {
  const state = store.getState();
  const { totalLockedDOT, totalInterBTC, interBtcLoaded } = state.general;
  if (!interBtcLoaded) return;

  try {
    const [latestTotalInterBTC, latestTotalLockedDOT] = await Promise.all([
      window.interBTC.treasury.total(),
      window.interBTC.collateral.totalLocked()
    ]);

    // update store only if there is a difference between the latest totals and current totals
    if (totalInterBTC !== latestTotalInterBTC.toString() || totalLockedDOT !== latestTotalLockedDOT.toString()) {
      dispatch(updateTotalsAction(
        displayDotAmount(latestTotalLockedDOT),
        displayBtcAmount(latestTotalInterBTC)
      ));
    }
  } catch (error) {
    console.log(error);
  }
}
