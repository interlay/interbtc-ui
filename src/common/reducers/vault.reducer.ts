import {
  ADD_REPLACE_REQUESTS,
  UPDATE_COLLATERALIZATION,
  UPDATE_BTC_ADDRESS,
  UPDATE_COLLATERAL,
  UPDATE_LOCKED_BTC,
  UPDATE_SLA,
  UPDATE_PREMIUM_VAULT,
  UPDATE_APY,
  VaultActions,
  RESET_REDEEM_WIZARD,
  INIT_STATE
} from '../types/actions.types';
import { VaultState } from '../types/vault.types';

const initialState = {
  requests: [],
  btcAddress: '',
  collateralization: '0',
  collateral: '',
  lockedBTC: '',
  sla: '0',
  premiumVault: undefined,
  apy: '0'
};

export const vaultReducer = (state: VaultState = initialState, action: VaultActions): VaultState => {
  switch (action.type) {
  case ADD_REPLACE_REQUESTS:
    return { ...state, requests: action.requests };
  case UPDATE_COLLATERALIZATION:
    return { ...state, collateralization: action.collateralization };
  case UPDATE_BTC_ADDRESS:
    return { ...state, btcAddress: action.btcAddress };
  case UPDATE_COLLATERAL:
    return { ...state, collateral: action.collateral };
  case UPDATE_LOCKED_BTC:
    return { ...state, lockedBTC: action.lockedBTC };
  case UPDATE_SLA:
    return { ...state, sla: action.sla };
  case UPDATE_PREMIUM_VAULT:
    return { ...state, premiumVault: action.vault };
  case RESET_REDEEM_WIZARD:
    return { ...state, premiumVault: undefined };
  case INIT_STATE:
    return { ...state, premiumVault: undefined };
  case UPDATE_APY:
    return { ...state, apy: action.apy };
  default:
    return state;
  }
};
