import { CollateralCurrencyExt } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';

import { GovernanceTokenMonetaryAmount } from '@/config/relay-chains';

import { ParachainStatus, StoreType } from './util.types';

// GENERAL ACTIONS
export const IS_BRIDGE_LOADED = 'IS_BRIDGE_LOADED';
export const IS_FAUCET_LOADED = 'IS_FAUCET_LOADED';
export const IS_VAULT_CLIENT_LOADED = 'IS_VAULT_CLIENT_LOADED';
export const INIT_STATE = 'INIT_STATE';
export const INIT_GENERAL_DATA_ACTION = 'INIT_GENERAL_DATA_ACTION';
export const UPDATE_BALANCE_POLKA_BTC = 'UPDATE_BALANCE_POLKA_BTC';
export const UPDATE_WRAPPED_TOKEN_TRANSFERABLE_BALANCE = 'UPDATE_WRAPPED_TOKEN_TRANSFERABLE_BALANCE';
export const UPDATE_COLLATERAL_TOKEN_BALANCE = 'UPDATE_COLLATERAL_TOKEN_BALANCE';
export const UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE = 'UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE';
export const SHOW_ACCOUNT_MODAL = 'SHOW_ACCOUNT_MODAL';
export const SHOW_SIGN_TERMS_MODAL = 'SHOW_SIGN_TERMS_MODAL';
export const UPDATE_HEIGHTS = 'UPDATE_HEIGHTS';
export const UPDATE_TOTALS = 'UPDATE_TOTALS';
export const SHOW_BUY_MODAL = 'SHOW_BUY_MODAL';

export interface UpdateTotals {
  type: typeof UPDATE_TOTALS;
  totalLockedCollateralTokenAmount: MonetaryAmount<CollateralCurrencyExt>;
  totalWrappedTokenAmount: BitcoinAmount;
}

export interface UpdateHeights {
  type: typeof UPDATE_HEIGHTS;
  btcRelayHeight: number;
  bitcoinHeight: number;
}

export interface IsBridgeLoaded {
  type: typeof IS_BRIDGE_LOADED;
  isLoaded: boolean;
}

export interface IsFaucetLoaded {
  type: typeof IS_FAUCET_LOADED;
  isLoaded: boolean;
}

export interface IsVaultClientLoaded {
  type: typeof IS_VAULT_CLIENT_LOADED;
  isLoaded: boolean;
}

export interface InitState {
  type: typeof INIT_STATE;
  state: StoreType;
}

export interface InitGeneralDataAction {
  type: typeof INIT_GENERAL_DATA_ACTION;
  totalWrappedTokenAmount: BitcoinAmount;
  totalLockedCollateralTokenAmount: MonetaryAmount<CollateralCurrencyExt>;
  totalGovernanceTokenAmount: GovernanceTokenMonetaryAmount;
  btcRelayHeight: number;
  bitcoinHeight: number;
  parachainStatus: ParachainStatus;
}

export interface UpdateBalancePolkaBTC {
  type: typeof UPDATE_BALANCE_POLKA_BTC;
  wrappedTokenBalance: BitcoinAmount;
}

export interface UpdateWrappedTokenTransferableBalance {
  type: typeof UPDATE_WRAPPED_TOKEN_TRANSFERABLE_BALANCE;
  wrappedTokenTransferableBalance: BitcoinAmount;
}

export interface UpdateCollateralTokenBalance {
  type: typeof UPDATE_COLLATERAL_TOKEN_BALANCE;
  collateralTokenBalance: MonetaryAmount<CollateralCurrencyExt>;
}

export interface UpdateCollateralTokenTransferableBalance {
  type: typeof UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE;
  collateralTokenTransferableBalance: MonetaryAmount<CollateralCurrencyExt>;
}

export interface ShowAccountModal {
  type: typeof SHOW_ACCOUNT_MODAL;
  showAccountModal: boolean;
}

export interface ShowSignTermsModal {
  type: typeof SHOW_SIGN_TERMS_MODAL;
  isSignTermsModalOpen: boolean;
}

export interface ShowBuyModal {
  type: typeof SHOW_BUY_MODAL;
  isBuyModalOpen: boolean;
}

export type GeneralActions =
  | IsBridgeLoaded
  | InitGeneralDataAction
  | IsVaultClientLoaded
  | UpdateBalancePolkaBTC
  | UpdateWrappedTokenTransferableBalance
  | UpdateCollateralTokenBalance
  | UpdateCollateralTokenTransferableBalance
  | ShowAccountModal
  | UpdateHeights
  | UpdateTotals
  | ShowBuyModal
  | ShowSignTermsModal;

// REDEEM
export const ADD_VAULT_REDEEMS = 'ADD_VAULT_REDEEMS';
export const TOGGLE_PREMIUM_REDEEM = 'TOGGLE_PREMIUM_REDEEM';

export interface TogglePremiumRedeem {
  type: typeof TOGGLE_PREMIUM_REDEEM;
  premiumRedeem: boolean;
}

export type RedeemActions = TogglePremiumRedeem;

// VAULT

export const UPDATE_COLLATERALIZATION = 'UPDATE_COLLATERALIZATION';
export const UPDATE_COLLATERAL = 'UPDATE_COLLATERAL';
export const UPDATE_LOCKED_BTC = 'UPDATE_LOCKED_BTC';
export const UPDATE_APY = 'UPDATE_APY';

export interface UpdateCollateralization {
  type: typeof UPDATE_COLLATERALIZATION;
  collateralization: string | undefined;
}

export interface UpdateCollateral {
  type: typeof UPDATE_COLLATERAL;
  collateral: MonetaryAmount<CollateralCurrencyExt>;
}

export interface UpdateLockedBTC {
  type: typeof UPDATE_LOCKED_BTC;
  lockedBTC: BitcoinAmount;
}

export interface UpdateAPY {
  type: typeof UPDATE_APY;
  apy: string;
}

export type VaultActions = UpdateCollateralization | UpdateCollateral | UpdateLockedBTC | InitState | UpdateAPY;
