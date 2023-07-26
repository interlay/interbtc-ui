import {
  ADD_NOTIFICATION,
  AddNotification,
  IS_BRIDGE_LOADED,
  IS_FAUCET_LOADED,
  IS_VAULT_CLIENT_LOADED,
  IsBridgeLoaded,
  IsFaucetLoaded,
  IsVaultClientLoaded,
  SHOW_ACCOUNT_MODAL,
  SHOW_BUY_MODAL,
  SHOW_SIGN_TERMS_MODAL,
  ShowAccountModal,
  ShowBuyModal,
  ShowSignTermsModal,
  UPDATE_TRANSACTION_MODAL_STATUS,
  UpdateTransactionModal
} from '../types/actions.types';
import { Notification, TransactionModalData } from '../types/util.types';

export const isBridgeLoaded = (isLoaded = false): IsBridgeLoaded => ({
  type: IS_BRIDGE_LOADED,
  isLoaded
});

export const isFaucetLoaded = (isLoaded = false): IsFaucetLoaded => ({
  type: IS_FAUCET_LOADED,
  isLoaded
});

export const isVaultClientLoaded = (isLoaded = false): IsVaultClientLoaded => ({
  type: IS_VAULT_CLIENT_LOADED,
  isLoaded
});

export const showAccountModalAction = (showAccountModal: boolean): ShowAccountModal => ({
  type: SHOW_ACCOUNT_MODAL,
  showAccountModal
});

export const showSignTermsModalAction = (isSignTermsModalOpen: boolean): ShowSignTermsModal => ({
  type: SHOW_SIGN_TERMS_MODAL,
  isSignTermsModalOpen
});

export const showBuyModal = (isBuyModalOpen: boolean): ShowBuyModal => ({
  type: SHOW_BUY_MODAL,
  isBuyModalOpen
});

export const addNotification = (accountAddress: string, notification: Notification): AddNotification => ({
  type: ADD_NOTIFICATION,
  accountAddress,
  notification
});

export const updateTransactionModal = (isOpen: boolean, data: TransactionModalData): UpdateTransactionModal => ({
  type: UPDATE_TRANSACTION_MODAL_STATUS,
  isOpen,
  data
});
