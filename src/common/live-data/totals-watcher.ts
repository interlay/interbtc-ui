import {
  displayBtcAmount,
  displayDotAmount
} from 'common/utils/utils';
import { Dispatch } from 'redux';
import { updateTotalsAction } from '../actions/general.actions';
import { StoreState } from '../types/util.types';

export default async function fetchTotals(dispatch: Dispatch, store: StoreState): Promise<void> {
  const state = store.getState();
  const { totalLockedDOT, totalPolkaBTC, polkaBtcLoaded } = state.general;
  if (!polkaBtcLoaded) return;

  try {
    const [latestTotalPolkaBTC, latestTotalLockedDOT] = await Promise.all([
      window.polkaBTC.treasury.total(),
      window.polkaBTC.collateral.totalLocked()
    ]);

    // update store only if there is a difference between the latest totals and current totals
    if (totalPolkaBTC !== latestTotalPolkaBTC.toString() || totalLockedDOT !== latestTotalLockedDOT.toString()) {
      dispatch(updateTotalsAction(
        displayDotAmount(latestTotalLockedDOT),
        displayBtcAmount(latestTotalPolkaBTC)
      ));
    }
  } catch (error) {
    console.log(error);
  }
}
