import {
  IS_POLKA_BTC_LOADED,
  IS_STAKED_RELAYER_LOADED,
  IS_VAULT_CLIENT_LOADED,
  INIT_GENERAL_DATA_ACTION,
  CHANGE_ADDRESS,
  INIT_STATE,
  UPDATE_BALANCE_DOT,
  UPDATE_BALANCE_POLKA_BTC,
  GeneralActions,
  SET_INSTALLED_EXTENSION,
  SHOW_ACCOUNT_MODAL,
  UPDATE_OF_PRICES,
  UPDATE_HEIGHTS,
  UPDATE_TOTALS
} from '../types/actions.types';
import { GeneralState, ParachainStatus } from '../types/util.types';

const initialState = {
  interBtcLoaded: false,
  relayerLoaded: false,
  vaultClientLoaded: false,
  hasFeedbackModalBeenDisplayed: false,
  showAccountModal: false,
  address: '',
  totalInterBTC: '0',
  totalLockedDOT: '0',
  balanceInterBTC: '',
  balanceDOT: '',
  extensions: [],
  btcRelayHeight: 0,
  bitcoinHeight: 0,
  parachainStatus: ParachainStatus.Loading,
  prices: { bitcoin: { usd: 0 }, polkadot: { usd: 0 } }
};

export const generalReducer = (state: GeneralState = initialState, action: GeneralActions): GeneralState => {
  switch (action.type) {
  case UPDATE_TOTALS:
    return { ...state, totalInterBTC: action.totalInterBTC, totalLockedDOT: action.totalLockedDOT };
  case UPDATE_HEIGHTS:
    return { ...state, btcRelayHeight: action.btcRelayHeight, bitcoinHeight: action.bitcoinHeight };
  case UPDATE_OF_PRICES:
    return { ...state, prices: action.prices };
  case IS_POLKA_BTC_LOADED:
    return { ...state, interBtcLoaded: action.isLoaded };
  case IS_STAKED_RELAYER_LOADED:
    return { ...state, relayerLoaded: action.isLoaded };
  case CHANGE_ADDRESS:
    return { ...state, address: action.address };
  case INIT_STATE:
    return {
      ...state,
      interBtcLoaded: false,
      relayerLoaded: false,
      vaultClientLoaded: false,
      showAccountModal: false,
      extensions: []
    };
  case INIT_GENERAL_DATA_ACTION:
    return {
      ...state,
      totalLockedDOT: action.totalLockedDOT,
      totalInterBTC: action.totalInterBTC,
      btcRelayHeight: action.btcRelayHeight,
      bitcoinHeight: action.bitcoinHeight,
      parachainStatus: action.parachainStatus
    };
  case IS_VAULT_CLIENT_LOADED:
    return { ...state, vaultClientLoaded: action.isLoaded };
  case UPDATE_BALANCE_DOT:
    return { ...state, balanceDOT: action.balanceDOT };
  case UPDATE_BALANCE_POLKA_BTC:
    return { ...state, balanceInterBTC: action.balanceInterBTC };
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
