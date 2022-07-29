import { newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';

import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';

import {
  CHANGE_ADDRESS,
  GeneralActions,
  INIT_GENERAL_DATA_ACTION,
  IS_BRIDGE_LOADED,
  IS_VAULT_CLIENT_LOADED,
  SET_INSTALLED_EXTENSION,
  SHOW_ACCOUNT_MODAL,
  UPDATE_BALANCE_POLKA_BTC,
  UPDATE_COLLATERAL_TOKEN_BALANCE,
  UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE,
  UPDATE_HEIGHTS,
  UPDATE_TOTALS,
  UPDATE_WRAPPED_TOKEN_TRANSFERABLE_BALANCE
} from '../types/actions.types';
import { GeneralState, ParachainStatus } from '../types/util.types';

const initialState = {
  bridgeLoaded: false,
  vaultClientLoaded: false,
  hasFeedbackModalBeenDisplayed: false,
  showAccountModal: false,
  address: '',
  totalWrappedTokenAmount: BitcoinAmount.zero(),
  totalLockedCollateralTokenAmount: newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN),
  wrappedTokenBalance: BitcoinAmount.zero(),
  wrappedTokenTransferableBalance: BitcoinAmount.zero(),
  collateralTokenBalance: newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN),
  collateralTokenTransferableBalance: newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN),
  extensions: [],
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
    case CHANGE_ADDRESS:
      return { ...state, address: action.address };
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
    case UPDATE_COLLATERAL_TOKEN_BALANCE:
      return { ...state, collateralTokenBalance: action.collateralTokenBalance };
    case UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE:
      return { ...state, collateralTokenTransferableBalance: action.collateralTokenTransferableBalance };
    case UPDATE_BALANCE_POLKA_BTC:
      return { ...state, wrappedTokenBalance: action.wrappedTokenBalance };
    case UPDATE_WRAPPED_TOKEN_TRANSFERABLE_BALANCE:
      return { ...state, wrappedTokenTransferableBalance: action.wrappedTokenTransferableBalance };
    case SHOW_ACCOUNT_MODAL:
      return { ...state, showAccountModal: action.showAccountModal };
    case SET_INSTALLED_EXTENSION:
      return {
        ...state,
        extensions: action.extensions,
        address: action.extensions.length ? state.address : ''
      };
    default:
      return state;
  }
};
