import { newMonetaryAmount, ReplaceRequestExt } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';
import { H256 } from '@polkadot/types/interfaces';

import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';

import {
  UPDATE_APY,
  UPDATE_COLLATERAL,
  UPDATE_COLLATERALIZATION,
  UPDATE_LOCKED_BTC,
  VaultActions
} from '../types/actions.types';
import { VaultState } from '../types/vault.types';

const initialState = {
  requests: new Map<H256, ReplaceRequestExt>(),
  collateralization: '0',
  collateral: newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN),
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
