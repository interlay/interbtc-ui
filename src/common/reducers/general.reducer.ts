import { TransactionStatus } from '@/hooks/transaction/types';

import {
  ADD_NOTIFICATION,
  GeneralActions,
  IS_BRIDGE_LOADED,
  IS_VAULT_CLIENT_LOADED,
  SHOW_ACCOUNT_MODAL,
  SHOW_BUY_MODAL,
  SHOW_SIGN_TERMS_MODAL,
  UPDATE_TRANSACTION_MODAL_STATUS
} from '../types/actions.types';
import { GeneralState } from '../types/util.types';

const initialState = {
  bridgeLoaded: false,
  vaultClientLoaded: false,
  hasFeedbackModalBeenDisplayed: false,
  showAccountModal: false,
  isBuyModalOpen: false,
  isSignTermsModalOpen: false,
  prices: {
    bitcoin: { usd: 0 },
    relayChainNativeToken: { usd: 0 },
    governanceToken: { usd: 0 },
    wrappedToken: { usd: 0 }
  },
  notifications: {},
  transactionModal: {
    isOpen: false,
    data: { variant: TransactionStatus.CONFIRM }
  }
};

export const generalReducer = (state: GeneralState = initialState, action: GeneralActions): GeneralState => {
  switch (action.type) {
    case IS_BRIDGE_LOADED:
      return { ...state, bridgeLoaded: action.isLoaded };
    case IS_VAULT_CLIENT_LOADED:
      return { ...state, vaultClientLoaded: action.isLoaded };
    case SHOW_ACCOUNT_MODAL:
      return { ...state, showAccountModal: action.showAccountModal };
    case SHOW_BUY_MODAL:
      return { ...state, isBuyModalOpen: action.isBuyModalOpen };
    case SHOW_SIGN_TERMS_MODAL:
      return { ...state, isSignTermsModalOpen: action.isSignTermsModalOpen };
    case ADD_NOTIFICATION: {
      const newAccountNotifications = [...(state.notifications[action.accountAddress] || []), action.notification];

      return {
        ...state,
        notifications: {
          ...state.notifications,
          [action.accountAddress]: newAccountNotifications
        }
      };
    }
    case UPDATE_TRANSACTION_MODAL_STATUS:
      return {
        ...state,
        transactionModal: {
          ...state.transactionModal,
          ...action
        }
      };
    default:
      return state;
  }
};
