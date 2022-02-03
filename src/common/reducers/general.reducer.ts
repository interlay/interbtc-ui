import { BitcoinAmount } from '@interlay/monetary-js';
import { newMonetaryAmount } from '@interlay/interbtc-api';

import {
  COLLATERAL_TOKEN,
  GOVERNANCE_TOKEN
} from 'config/relay-chains';
import {
  IS_POLKA_BTC_LOADED,
  IS_VAULT_CLIENT_LOADED,
  INIT_GENERAL_DATA_ACTION,
  CHANGE_ADDRESS,
  UPDATE_COLLATERAL_TOKEN_BALANCE,
  UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE,
  UPDATE_GOVERNANCE_TOKEN_BALANCE,
  UPDATE_GOVERNANCE_TOKEN_TRANSFERABLE_BALANCE,
  UPDATE_BALANCE_POLKA_BTC,
  UPDATE_WRAPPED_TOKEN_TRANSFERABLE_BALANCE,
  GeneralActions,
  SET_INSTALLED_EXTENSION,
  SHOW_ACCOUNT_MODAL,
  UPDATE_OF_PRICES,
  UPDATE_HEIGHTS,
  UPDATE_TOTALS
} from '../types/actions.types';
import { GeneralState, ParachainStatus } from '../types/util.types';

const initialState = {
  bridgeLoaded: false,
  vaultClientLoaded: false,
  hasFeedbackModalBeenDisplayed: false,
  showAccountModal: false,
  address: '',
  totalWrappedTokenAmount: BitcoinAmount.zero,
  totalLockedCollateralTokenAmount: newMonetaryAmount(0, COLLATERAL_TOKEN),
  wrappedTokenBalance: BitcoinAmount.zero,
  wrappedTokenTransferableBalance: BitcoinAmount.zero,
  collateralTokenBalance: newMonetaryAmount(0, COLLATERAL_TOKEN),
  collateralTokenTransferableBalance: newMonetaryAmount(0, COLLATERAL_TOKEN),
  governanceTokenBalance: newMonetaryAmount(0, GOVERNANCE_TOKEN),
  governanceTokenTransferableBalance: newMonetaryAmount(0, GOVERNANCE_TOKEN),
  extensions: [],
  btcRelayHeight: 0,
  bitcoinHeight: 0,
  parachainStatus: ParachainStatus.Loading,
  prices: {
    bitcoin: { usd: 0 },
    collateralToken: { usd: 0 },
    governanceToken: { usd: 0 }
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
  case UPDATE_OF_PRICES:
    return { ...state, prices: action.prices };
  case IS_POLKA_BTC_LOADED:
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
  case UPDATE_GOVERNANCE_TOKEN_BALANCE:
    return { ...state, governanceTokenBalance: action.governanceTokenBalance };
  case UPDATE_GOVERNANCE_TOKEN_TRANSFERABLE_BALANCE:
    return { ...state, governanceTokenTransferableBalance: action.governanceTokenTransferableBalance };
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
