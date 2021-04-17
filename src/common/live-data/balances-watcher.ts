import { Dispatch } from 'redux';
import { updateBalanceDOTAction, updateBalancePolkaBTCAction } from '../actions/general.actions';
import { StoreState } from '../types/util.types';
import { satToBTC } from '@interlay/polkabtc';
import { ACCOUNT_ID_TYPE_NAME } from '../../constants';

export default async function fetchBalances(dispatch: Dispatch, store: StoreState): Promise<void> {
  const state = store.getState();
  const { balanceDOT, balancePolkaBTC, polkaBtcLoaded, address } = state.general;
  if (!polkaBtcLoaded) return;

  try {
    const accountId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
    const balancePolkaSAT = await window.polkaBTC.treasury.balancePolkaBTC(accountId);
    const latestBalanceDOT = await window.polkaBTC.collateral.balance(accountId);
    const latestBalancePolkaBTC = satToBTC(balancePolkaSAT.toString());

    // update store only if there is a difference between balances
    if (latestBalanceDOT.toString() !== balanceDOT) {
      dispatch(updateBalanceDOTAction(latestBalanceDOT.toString()));
    }

    if (latestBalancePolkaBTC !== balancePolkaBTC) {
      dispatch(updateBalancePolkaBTCAction(latestBalancePolkaBTC));
    }
  } catch (error) {
    console.log(error);
  }
}
