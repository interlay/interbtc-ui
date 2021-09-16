import { Bitcoin } from '@interlay/monetary-js';
import { Dispatch } from 'redux';

import { COLLATERAL_CURRENCY } from 'config/general';
import { updateTotalsAction } from '../actions/general.actions';
import { StoreState } from '../types/util.types';

export default async function fetchTotals(dispatch: Dispatch, store: StoreState): Promise<void> {
  const state = store.getState();
  const { totalLockedDOT, totalInterBTC, polkaBtcLoaded } = state.general;
  if (!polkaBtcLoaded) return;

  try {
    const [latestTotalPolkaBTC, latestTotalLockedDOT] = await Promise.all([
      window.polkaBTC.interBtcApi.tokens.total(Bitcoin),
      window.polkaBTC.interBtcApi.tokens.total(COLLATERAL_CURRENCY)
    ]);

    // update store only if there is a difference between the latest totals and current totals
    if (!totalInterBTC.eq(latestTotalPolkaBTC) || !totalLockedDOT.eq(latestTotalLockedDOT)) {
      dispatch(updateTotalsAction(
        latestTotalLockedDOT,
        latestTotalPolkaBTC
      ));
    }
  } catch (error) {
    console.log(error);
  }
}
