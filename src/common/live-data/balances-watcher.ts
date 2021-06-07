import { Dispatch } from 'redux';
import { updateBalanceDOTAction, updateBalanceInterBTCAction } from '../actions/general.actions';
import { StoreState } from '../types/util.types';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';

export default async function fetchBalances(dispatch: Dispatch, store: StoreState): Promise<void> {
  const state = store.getState();
  const { balanceDOT, balanceInterBTC, interBtcLoaded, address } = state.general;
  if (!interBtcLoaded) return;

  try {
    const accountId = window.interBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
    const latestBalanceInterBTC = (await window.interBTC.treasury.balance(accountId)).toString();
    const latestBalanceDOT = (await window.interBTC.collateral.balance(accountId)).toString();

    // update store only if there is a difference between balances
    if (latestBalanceDOT !== balanceDOT) {
      dispatch(updateBalanceDOTAction(latestBalanceDOT));
    }

    if (latestBalanceInterBTC !== balanceInterBTC) {
      dispatch(updateBalanceInterBTCAction(latestBalanceInterBTC));
    }
  } catch (error) {
    console.log(error);
  }
}
