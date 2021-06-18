
import { Dispatch } from 'redux';

import {
  updateBalanceDOTAction,
  updateBalancePolkaBTCAction
} from 'common/actions/general.actions';
import { StoreState } from 'common/types/util.types';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';

// ray test touch <
// TODO: should drop after testing
async function fetchBalances(dispatch: Dispatch, store: StoreState): Promise<void> {
  const state = store.getState();
  const {
    balanceDOT,
    balancePolkaBTC,
    polkaBtcLoaded,
    address
  } = state.general;
  if (!polkaBtcLoaded) return;

  try {
    const accountId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
    const newPolkaBTCBalance = (await window.polkaBTC.treasury.balance(accountId)).toString();
    const newDOTBalance = (await window.polkaBTC.collateral.balance(accountId)).toString();

    if (newDOTBalance !== balanceDOT) {
      dispatch(updateBalanceDOTAction(newDOTBalance));
    }
    if (newPolkaBTCBalance !== balancePolkaBTC) {
      dispatch(updateBalancePolkaBTCAction(newPolkaBTCBalance));
    }
  } catch (error) {
    console.log('[fetchBalances] error.message => ', error.message);
  }
}

export default fetchBalances;
// ray test touch >
