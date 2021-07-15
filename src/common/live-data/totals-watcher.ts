import { Bitcoin, Polkadot } from '@interlay/monetary-js';
import {
  displayMonetaryAmount
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
      window.polkaBTC.tokens.total(Bitcoin),
      window.polkaBTC.tokens.total(Polkadot)
    ]);

    // update store only if there is a difference between the latest totals and current totals
    if (totalPolkaBTC !== latestTotalPolkaBTC.toHuman() || totalLockedDOT !== latestTotalLockedDOT.toHuman()) {
      dispatch(updateTotalsAction(
        displayMonetaryAmount(latestTotalLockedDOT),
        displayMonetaryAmount(latestTotalPolkaBTC)
      ));
    }
  } catch (error) {
    console.log(error);
  }
}
