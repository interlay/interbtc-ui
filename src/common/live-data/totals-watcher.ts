import { Bitcoin } from '@interlay/monetary-js';
import { Dispatch } from 'redux';

import { COLLATERAL_TOKEN } from 'config/general';
import { updateTotalsAction } from '../actions/general.actions';
import { StoreState } from '../types/util.types';

export default async function fetchTotals(dispatch: Dispatch, store: StoreState): Promise<void> {
  const state = store.getState();
  const {
    totalLockedCollateralTokenAmount,
    totalInterBTC,
    polkaBtcLoaded
  } = state.general;
  if (!polkaBtcLoaded) return;

  try {
    const [latestTotalInterBTC, latestTotalLockedCollateralTokenAmount] = await Promise.all([
      window.polkaBTC.interBtcApi.tokens.total(Bitcoin),
      window.polkaBTC.interBtcApi.tokens.total(COLLATERAL_TOKEN)
    ]);

    // update store only if there is a difference between the latest totals and current totals
    if (
      !totalInterBTC.eq(latestTotalInterBTC) ||
      !totalLockedCollateralTokenAmount.eq(latestTotalLockedCollateralTokenAmount)
    ) {
      dispatch(updateTotalsAction(
        latestTotalLockedCollateralTokenAmount,
        latestTotalInterBTC
      ));
    }
  } catch (error) {
    console.log(error);
  }
}
