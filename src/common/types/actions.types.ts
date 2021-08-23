import { StoreType, ParachainStatus, Prices } from './util.types';
// ray test touch <<
import { Issue, ReplaceRequestExt } from '@interlay/interbtc-api';
// ray test touch >>
import {
  BTCAmount,
  PolkadotAmount
} from '@interlay/monetary-js';
import { H256 } from '@polkadot/types/interfaces';

// GENERAL ACTIONS

export const IS_POLKA_BTC_LOADED = 'IS_POLKA_BTC_LOADED';
export const IS_FAUCET_LOADED = 'IS_FAUCET_LOADED';
export const IS_VAULT_CLIENT_LOADED = 'IS_VAULT_CLIENT_LOADED';
export const INIT_STATE = 'INIT_STATE';
export const CHANGE_ADDRESS = 'CHANGE_ADDRESS';
export const INIT_GENERAL_DATA_ACTION = 'INIT_GENERAL_DATA_ACTION';
export const UPDATE_BALANCE_POLKA_BTC = 'UPDATE_BALANCE_POLKA_BTC';
export const UPDATE_BALANCE_DOT = 'UPDATE_BALANCE_DOT';
export const SET_INSTALLED_EXTENSION = 'SET_INSTALLED_EXTENSION';
export const SHOW_ACCOUNT_MODAL = 'SHOW_ACCOUNT_MODAL';
export const UPDATE_OF_PRICES = 'UPDATE_OF_PRICES';
export const UPDATE_HEIGHTS = 'UPDATE_HEIGHTS';
export const UPDATE_TOTALS = 'UPDATE_TOTALS';

export interface UpdateTotals {
  type: typeof UPDATE_TOTALS;
  totalLockedDOT: PolkadotAmount;
  totalInterBTC: BTCAmount;
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
  totalInterBTC: BTCAmount;
  totalLockedDOT: PolkadotAmount;
  btcRelayHeight: number;
  bitcoinHeight: number;
  parachainStatus: ParachainStatus;
}

export interface UpdateBalancePolkaBTC {
  type: typeof UPDATE_BALANCE_POLKA_BTC;
  balanceInterBTC: BTCAmount;
}

export interface UpdateBalanceDOT {
  type: typeof UPDATE_BALANCE_DOT;
  balanceDOT: PolkadotAmount;
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
  | UpdateBalanceDOT
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

export const ADD_REPLACE_REQUESTS = 'ADD_REPLACE_REQUESTS';
export const UPDATE_COLLATERALIZATION = 'UPDATE_COLLATERALIZATION';
export const UPDATE_COLLATERAL = 'UPDATE_COLLATERAL';
export const UPDATE_LOCKED_BTC = 'UPDATE_LOCKED_BTC';
// ray test touch <<
// export const UPDATE_SLA = 'UPDATE_SLA';
// ray test touch >>
export const UPDATE_APY = 'UPDATE_APY';

export interface AddReplaceRequests {
  type: typeof ADD_REPLACE_REQUESTS;
  requests: Map<H256, ReplaceRequestExt>;
}

export interface UpdateCollateralization {
  type: typeof UPDATE_COLLATERALIZATION;
  collateralization: string | undefined;
}

export interface UpdateCollateral {
  type: typeof UPDATE_COLLATERAL;
  collateral: PolkadotAmount;
}

export interface UpdateLockedBTC {
  type: typeof UPDATE_LOCKED_BTC;
  lockedBTC: BTCAmount;
}

// ray test touch <<
// export interface UpdateSLA {
//   type: typeof UPDATE_SLA;
//   sla: string;
// }
// ray test touch >>

export interface UpdateAPY {
  type: typeof UPDATE_APY;
  apy: string;
}

export type VaultActions =
  | AddReplaceRequests
  | UpdateCollateralization
  | UpdateCollateral
  | UpdateLockedBTC
  // ray test touch <<
  // | UpdateSLA
  // ray test touch >>
  | InitState
  | UpdateAPY;
