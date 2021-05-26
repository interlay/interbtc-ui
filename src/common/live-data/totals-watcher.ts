import { Dispatch } from 'redux';
import { updateTotalsAction } from '../actions/general.actions';
import { StoreState } from '../types/util.types';

export default async function fetchTotals(dispatch: Dispatch, store: StoreState): Promise<void> {
  const state = store.getState();
  const { totalLockedDOT, totalPolkaBTC, polkaBtcLoaded } = state.general;
  if (!polkaBtcLoaded) return;

  try {
    const latestTotalPolkaBTC = (await window.polkaBTC.treasury.total()).round(3).toString();
    const latestTotalLockedDOT = await window.polkaBTC.collateral.totalLocked();

    // update store only if there is a difference between the latest totals and current totals
    if (totalPolkaBTC !== latestTotalPolkaBTC || totalLockedDOT !== latestTotalLockedDOT.toString()) {
      dispatch(updateTotalsAction(latestTotalLockedDOT.toString(), latestTotalPolkaBTC));
    }
  } catch (error) {
    console.log(error);
  }
}
