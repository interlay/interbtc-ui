import { BitcoinAmount } from '@interlay/monetary-js';
import {
  ReplaceRequestExt,
  newMonetaryAmount
} from '@interlay/interbtc-api';
import { H256 } from '@polkadot/types/interfaces';

import { COLLATERAL_TOKEN } from 'config/relay-chains';
import {
  UPDATE_COLLATERALIZATION,
  UPDATE_COLLATERAL,
  UPDATE_LOCKED_BTC,
  UPDATE_APY,
  VaultActions
} from '../types/actions.types';
import { VaultState } from '../types/vault.types';

const initialState = {
  requests: new Map<H256, ReplaceRequestExt>(),
  collateralization: '0',
  collateral: newMonetaryAmount(0, COLLATERAL_TOKEN),
  lockedBTC: BitcoinAmount.zero,
  apy: '0'
};

export const vaultReducer = (state: VaultState = initialState, action: VaultActions): VaultState => {
  switch (action.type) {
  case UPDATE_COLLATERALIZATION:
    return { ...state, collateralization: action.collateralization };
  case UPDATE_COLLATERAL:
    return { ...state, collateral: action.collateral };
  case UPDATE_LOCKED_BTC:
    return { ...state, lockedBTC: action.lockedBTC };
  case UPDATE_APY:
    return { ...state, apy: action.apy };
  default:
    return state;
  }
};
