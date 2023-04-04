import { newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';

import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';

import {
  GeneralActions,
  INIT_GENERAL_DATA_ACTION,
  IS_BRIDGE_LOADED,
  IS_VAULT_CLIENT_LOADED,
  SHOW_ACCOUNT_MODAL,
  SHOW_BUY_MODAL,
  UPDATE_HEIGHTS,
  UPDATE_TOTALS
} from '../types/actions.types';
import { GeneralState, ParachainStatus } from '../types/util.types';

const initialState = {
  bridgeLoaded: false,
  vaultClientLoaded: false,
  hasFeedbackModalBeenDisplayed: false,
  showAccountModal: false,
  isBuyModalOpen: false,
  totalWrappedTokenAmount: BitcoinAmount.zero(),
  totalLockedCollateralTokenAmount: newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN),
  btcRelayHeight: 0,
  bitcoinHeight: 0,
  parachainStatus: ParachainStatus.Loading,
  prices: {
    bitcoin: { usd: 0 },
    relayChainNativeToken: { usd: 0 },
    governanceToken: { usd: 0 },
    wrappedToken: { usd: 0 }
  }
};

export const generalReducer = (state: GeneralState = initialState, action: GeneralActions): GeneralState => {
  switch (action.type) {
    case UPDATE_TOTALS:
      return {
        ...state,
        totalWrappedTokenAmount: action.totalWrappedTokenAmount,
        totalLockedCollateralTokenAmount: action.totalLockedCollateralTokenAmount
      };
    case UPDATE_HEIGHTS:
      return { ...state, btcRelayHeight: action.btcRelayHeight, bitcoinHeight: action.bitcoinHeight };
    case IS_BRIDGE_LOADED:
      return { ...state, bridgeLoaded: action.isLoaded };
    case INIT_GENERAL_DATA_ACTION:
      return {
        ...state,
        totalLockedCollateralTokenAmount: action.totalLockedCollateralTokenAmount,
        totalWrappedTokenAmount: action.totalWrappedTokenAmount,
        btcRelayHeight: action.btcRelayHeight,
        bitcoinHeight: action.bitcoinHeight,
        parachainStatus: action.parachainStatus
      };
    case IS_VAULT_CLIENT_LOADED:
      return { ...state, vaultClientLoaded: action.isLoaded };
    case SHOW_ACCOUNT_MODAL:
      return { ...state, showAccountModal: action.showAccountModal };
    case SHOW_BUY_MODAL:
      return { ...state, isBuyModalOpen: action.isBuyModalOpen };
    default:
      return state;
  }
};
