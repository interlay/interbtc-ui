import {
  ADD_REPLACE_REQUESTS,
  UPDATE_COLLATERALIZATION,
  UPDATE_COLLATERAL,
  UPDATE_LOCKED_BTC,
  UPDATE_SLA,
  UPDATE_APY,
  VaultActions
} from '../types/actions.types';
import { VaultState } from '../types/vault.types';

const initialState = {
  requests: [],
  collateralization: '0',
  collateral: '0',
  lockedBTC: '0',
  sla: '0',
  apy: '0'
};

export const vaultReducer = (state: VaultState = initialState, action: VaultActions): VaultState => {
  switch (action.type) {
  case ADD_REPLACE_REQUESTS:
    return { ...state, requests: action.requests };
  case UPDATE_COLLATERALIZATION:
    return { ...state, collateralization: action.collateralization };
  case UPDATE_COLLATERAL:
    return { ...state, collateral: action.collateral };
  case UPDATE_LOCKED_BTC:
    return { ...state, lockedBTC: action.lockedBTC };
  case UPDATE_SLA:
    return { ...state, sla: action.sla };
  case UPDATE_APY:
    return { ...state, apy: action.apy };
  default:
    return state;
  }
};
