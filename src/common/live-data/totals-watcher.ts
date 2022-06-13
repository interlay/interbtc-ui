import { Dispatch } from 'redux';

import { RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

import { updateTotalsAction } from '../actions/general.actions';
import { StoreState } from '../types/util.types';

export default async function fetchTotals(dispatch: Dispatch, store: StoreState): Promise<void> {
  const state = store.getState();
  const { totalLockedCollateralTokenAmount, totalWrappedTokenAmount, bridgeLoaded } = state.general;
  if (!bridgeLoaded) return;

  try {
    const [latestTotalWrappedTokenAmount, latestTotalLockedCollateralTokenAmount] = await Promise.all([
      window.bridge.tokens.total(WRAPPED_TOKEN),
      window.bridge.tokens.total(RELAY_CHAIN_NATIVE_TOKEN)
    ]);

    // update store only if there is a difference between the latest totals and current totals
    if (
      !totalWrappedTokenAmount.eq(latestTotalWrappedTokenAmount) ||
      !totalLockedCollateralTokenAmount.eq(latestTotalLockedCollateralTokenAmount)
    ) {
      dispatch(updateTotalsAction(latestTotalLockedCollateralTokenAmount, latestTotalWrappedTokenAmount));
    }
  } catch (error) {
    console.log(error);
  }
}
