import { StoreType, ParachainStatus, Prices } from './util.types';
import {
  Issue,
  CollateralUnit,
  GovernanceUnit
} from '@interlay/interbtc-api';
import {
  BitcoinAmount,
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';

// GENERAL ACTIONS

export const IS_POLKA_BTC_LOADED = 'IS_POLKA_BTC_LOADED';
export const IS_FAUCET_LOADED = 'IS_FAUCET_LOADED';
export const IS_VAULT_CLIENT_LOADED = 'IS_VAULT_CLIENT_LOADED';
export const INIT_STATE = 'INIT_STATE';
export const CHANGE_ADDRESS = 'CHANGE_ADDRESS';
export const INIT_GENERAL_DATA_ACTION = 'INIT_GENERAL_DATA_ACTION';
export const UPDATE_BALANCE_POLKA_BTC = 'UPDATE_BALANCE_POLKA_BTC';
export const UPDATE_WRAPPED_TOKEN_TRANSFERABLE_BALANCE = 'UPDATE_WRAPPED_TOKEN_TRANSFERABLE_BALANCE';
export const UPDATE_COLLATERAL_TOKEN_BALANCE = 'UPDATE_COLLATERAL_TOKEN_BALANCE';
export const UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE = 'UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE';
export const UPDATE_GOVERNANCE_TOKEN_BALANCE = 'UPDATE_GOVERNANCE_TOKEN_BALANCE';
export const UPDATE_GOVERNANCE_TOKEN_TRANSFERABLE_BALANCE = 'UPDATE_GOVERNANCE_TOKEN_TRANSFERABLE_BALANCE';
export const SET_INSTALLED_EXTENSION = 'SET_INSTALLED_EXTENSION';
export const SHOW_ACCOUNT_MODAL = 'SHOW_ACCOUNT_MODAL';
export const UPDATE_OF_PRICES = 'UPDATE_OF_PRICES';
export const UPDATE_HEIGHTS = 'UPDATE_HEIGHTS';
export const UPDATE_TOTALS = 'UPDATE_TOTALS';

export interface UpdateTotals {
  type: typeof UPDATE_TOTALS;
  totalLockedCollateralTokenAmount: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
  totalWrappedTokenAmount: BitcoinAmount;
}

export interface UpdateHeights {
  type: typeof UPDATE_HEIGHTS;
  btcRelayHeight: number;
  bitcoinHeight: number;
}

export interface UpdateOfPrices {
  type: typeof UPDATE_OF_PRICES;
  prices: Prices;
}
export interface IsPolkaBtcLoaded {
  type: typeof IS_POLKA_BTC_LOADED;
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

export interface ChangeAddress {
  type: typeof CHANGE_ADDRESS;
  address: string;
}

export interface InitState {
  type: typeof INIT_STATE;
  state: StoreType;
}

export interface InitGeneralDataAction {
  type: typeof INIT_GENERAL_DATA_ACTION;
  totalWrappedTokenAmount: BitcoinAmount;
  totalLockedCollateralTokenAmount: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
  totalGovernanceTokenAmount: MonetaryAmount<Currency<GovernanceUnit>, GovernanceUnit>;
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
  collateralTokenBalance: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
}

export interface UpdateCollateralTokenTransferableBalance {
  type: typeof UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE;
  collateralTokenTransferableBalance: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
}

export interface UpdateGovernanceTokenBalance {
  type: typeof UPDATE_GOVERNANCE_TOKEN_BALANCE;
  governanceTokenBalance: MonetaryAmount<Currency<GovernanceUnit>, GovernanceUnit>;
}

export interface UpdateGovernanceTokenTransferableBalance {
  type: typeof UPDATE_GOVERNANCE_TOKEN_TRANSFERABLE_BALANCE;
  governanceTokenTransferableBalance: MonetaryAmount<Currency<GovernanceUnit>, GovernanceUnit>;
}

export interface SetInstalledExtension {
  type: typeof SET_INSTALLED_EXTENSION;
  extensions: string[];
}

export interface ShowAccountModal {
  type: typeof SHOW_ACCOUNT_MODAL;
  showAccountModal: boolean;
}

export type GeneralActions =
  | IsPolkaBtcLoaded
  | ChangeAddress
  | InitGeneralDataAction
  | IsVaultClientLoaded
  | UpdateBalancePolkaBTC
  | UpdateWrappedTokenTransferableBalance
  | UpdateCollateralTokenBalance
  | UpdateCollateralTokenTransferableBalance
  | UpdateGovernanceTokenBalance
  | UpdateGovernanceTokenTransferableBalance
  | SetInstalledExtension
  | ShowAccountModal
  | UpdateOfPrices
  | UpdateHeights
  | UpdateTotals;

// REDEEM
export const ADD_VAULT_REDEEMS = 'ADD_VAULT_REDEEMS';
export const TOGGLE_PREMIUM_REDEEM = 'TOGGLE_PREMIUM_REDEEM';

export interface TogglePremiumRedeem {
  type: typeof TOGGLE_PREMIUM_REDEEM;
  premiumRedeem: boolean;
}

export type RedeemActions =
    | ChangeAddress
    | InitState
    | TogglePremiumRedeem;

// ISSUE
export const STORE_ISSUE_REQUEST = 'STORE_ISSUE_REQUEST';
export const UPDATE_ISSUE_PERIOD = 'UPDATE_ISSUE_PERIOD';

export interface StoreIssueRequest {
  type: typeof STORE_ISSUE_REQUEST;
  request: Issue;
}

export interface UpdateIssuePeriod {
  type: typeof UPDATE_ISSUE_PERIOD;
  period: number;
}

export type IssueActions =
    | StoreIssueRequest
    | ChangeAddress
    | InitState
    | UpdateIssuePeriod;

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
  collateral: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
}

export interface UpdateLockedBTC {
  type: typeof UPDATE_LOCKED_BTC;
  lockedBTC: BitcoinAmount;
}

export interface UpdateAPY {
  type: typeof UPDATE_APY;
  apy: string;
}

export type VaultActions =
  | UpdateCollateralization
  | UpdateCollateral
  | UpdateLockedBTC
  | InitState
  | UpdateAPY;
