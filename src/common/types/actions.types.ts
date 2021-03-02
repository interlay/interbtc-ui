import { IssueRequest, VaultIssue } from './issue.types';
import { RedeemRequest, VaultRedeem } from './redeem.types';
import { VaultReplaceRequest, Vault } from './vault.types';
import { StoreType, ParachainStatus, ActiveTab, Prices } from './util.types';

// GENERAL ACTIONS

export const IS_POLKA_BTC_LOADED = 'IS_POLKA_BTC_LOADED';
export const IS_STAKED_RELAYER_LOADED = 'IS_STAKED_RELAYER_LOADED';
export const IS_FAUCET_LOADED = 'IS_FAUCET_LOADED';
export const IS_VAULT_CLIENT_LOADED = 'IS_VAULT_CLIENT_LOADED';
export const INIT_STATE = 'INIT_STATE';
export const CHANGE_ADDRESS = 'CHANGE_ADDRESS';
export const INIT_GENERAL_DATA_ACTION = 'INIT_GENERAL_DATA_ACTION';
export const UPDATE_BALANCE_POLKA_BTC = 'UPDATE_BALANCE_POLKA_BTC';
export const UPDATE_BALANCE_DOT = 'UPDATE_BALANCE_DOT';
export const SET_INSTALLED_EXTENSION = 'SET_INSTALLED_EXTENSION';
export const SHOW_ACCOUNT_MODAL = 'SHOW_ACCOUNT_MODAL';
export const UPDATE_ACCOUNTS = 'UPDATE_ACCOUNTS';
export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';
export const UPDATE_OF_PRICES = 'UPDATE_OF_PRICES';
export const UPDATE_HEIGHTS = 'UPDATE_HEIGHTS';
export const UPDATE_TOTALS = 'UPDATE_TOTALS';

export interface UpdateTotals {
    type: typeof UPDATE_TOTALS;
    totalLockedDOT: string;
    totalPolkaBTC: string;
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

export interface SetActiveTab {
    type: typeof SET_ACTIVE_TAB;
    activeTab: ActiveTab;
}

export interface IsStakedRelayerLoaded {
    type: typeof IS_STAKED_RELAYER_LOADED;
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
    totalPolkaBTC: string;
    totalLockedDOT: string;
    btcRelayHeight: number;
    bitcoinHeight: number;
    stateOfBTCParachain: ParachainStatus;
}

export interface UpdateBalancePolkaBTC {
    type: typeof UPDATE_BALANCE_POLKA_BTC;
    balancePolkaBTC: string;
}

export interface UpdateBalanceDOT {
    type: typeof UPDATE_BALANCE_DOT;
    balanceDOT: string;
}

export interface SetInstalledExtension {
    type: typeof SET_INSTALLED_EXTENSION;
    extensions: string[];
}

export interface ShowAccountModal {
    type: typeof SHOW_ACCOUNT_MODAL;
    showAccountModal: boolean;
}

export interface UpdateAccounts {
    type: typeof UPDATE_ACCOUNTS;
    accounts: string[];
}

export type GeneralActions =
    | IsPolkaBtcLoaded
    | IsStakedRelayerLoaded
    | ChangeAddress
    | InitState
    | InitGeneralDataAction
    | IsVaultClientLoaded
    | UpdateBalancePolkaBTC
    | UpdateBalanceDOT
    | SetInstalledExtension
    | ShowAccountModal
    | UpdateAccounts
    | SetActiveTab
    | UpdateOfPrices
    | UpdateHeights
    | UpdateTotals;

// REDEEM

export const CHANGE_REDEEM_STEP = 'CHANGE_REDEEM_STEP';
export const CHANGE_REDEEM_ID = 'CHANGE_REDEEM_ID';
export const SET_REDEEM_REQUESTS = 'SET_REDEEM_REQUESTS';
export const RESET_REDEEM_WIZARD = 'RESET_REDEEM_WIZARD';
export const STORE_REDEEM_REQUEST = 'STORE_REDEEM_REQUEST';
export const ADD_REDEEM_REQUEST = 'ADD_REDEEM_REQUEST';
export const ADD_VAULT_REDEEMS = 'ADD_VAULT_REDEEMS';
export const UPDATE_REDEEM_REQUEST = 'UPDATE_REDEEM_REQUEST';
export const UPDATE_ALL_REDEEM_REQUESTS = 'UPDATE_ALL_REDEEM_REQUESTS';
export const RETRY_REDEEM_REQUEST = 'RETRY_REDEEM_REQUEST';
export const REDEEM_EXPIRED = 'REDEEM_EXPIRED';
export const REIMBURSE_REDEEM_REQUEST = 'REIMBURSE_REDEEM_REQUEST';
export const TOGGLE_PREMIUM_REDEEM = 'TOGGLE_PREMIUM_REDEEM';

export interface TogglePremiumRedeem {
    type: typeof TOGGLE_PREMIUM_REDEEM;
    premiumRedeem: boolean;
}

export interface ChangeRedeemStep {
    type: typeof CHANGE_REDEEM_STEP;
    step: string;
}

export interface ChangeRedeemId {
    type: typeof CHANGE_REDEEM_ID;
    id: string;
}

export interface ResetRedeemWizard {
    type: typeof RESET_REDEEM_WIZARD;
}

export interface SetRedeemRequests {
    type: typeof SET_REDEEM_REQUESTS;
    requests: RedeemRequest[];
}

export interface StoreRedeemRequest {
    type: typeof STORE_REDEEM_REQUEST;
    request: RedeemRequest;
}

export interface AddRedeemRequest {
    type: typeof ADD_REDEEM_REQUEST;
    request: RedeemRequest;
}

export interface AddVaultRedeems {
    type: typeof ADD_VAULT_REDEEMS;
    vaultRedeems: VaultRedeem[];
}

export interface UpdateRedeemRequest {
    type: typeof UPDATE_REDEEM_REQUEST;
    request: RedeemRequest;
}

export interface UpdateAllRedeemRequests {
    type: typeof UPDATE_ALL_REDEEM_REQUESTS;
    userDotAddress: string;
    redeemRequests: RedeemRequest[];
}

export interface RetryRedeemRequest {
    type: typeof RETRY_REDEEM_REQUEST;
    id: string;
}

export interface RedeemExpired {
    type: typeof REDEEM_EXPIRED;
    request: RedeemRequest;
}

export interface ReimburseRedeemRequest {
    type: typeof REIMBURSE_REDEEM_REQUEST;
    id: string;
}

export type RedeemActions =
    | ChangeRedeemStep
    | ChangeRedeemId
    | ResetRedeemWizard
    | SetRedeemRequests
    | StoreRedeemRequest
    | AddRedeemRequest
    | ChangeAddress
    | InitState
    | AddVaultRedeems
    | UpdateRedeemRequest
    | UpdateAllRedeemRequests
    | RetryRedeemRequest
    | RedeemExpired
    | ReimburseRedeemRequest
    | TogglePremiumRedeem;

// ISSUE

export const CHANGE_ISSUE_STEP = 'CHANGE_ISSUE_STEP';
export const CHANGE_ISSUE_ID = 'CHANGE_ISSUE_ID';
export const RESET_ISSUE_WIZARD = 'RESET_ISSUE_WIZARD';
export const STORE_ISSUE_REQUEST = 'STORE_ISSUE_REQUEST';
export const ADD_ISSUE_REQUEST = 'ADD_ISSUE_REQUEST';
export const UPDATE_ISSUE_REQUEST = 'UPDATE_ISSUE_REQUEST';
export const ADD_VAULT_ISSUES = 'ADD_VAULT_ISSUES';
export const UPDATE_ALL_ISSUE_REQUESTS = 'UPDATE_ALL_ISSUE_REQUESTS';
export const CHANGE_SELECTED_ISSUE = 'CHANGE_SELECTED_ISSUE';

export interface ChangeSelectedIssue {
    type: typeof CHANGE_SELECTED_ISSUE;
    request: IssueRequest;
}

export interface AddVaultIssues {
    type: typeof ADD_VAULT_ISSUES;
    vaultIssues: VaultIssue[];
}

export interface ChangeIssueStep {
    type: typeof CHANGE_ISSUE_STEP;
    step: string;
}

export interface ChangeIssueId {
    type: typeof CHANGE_ISSUE_ID;
    id: string;
}

export interface ResetIssueWizard {
    type: typeof RESET_ISSUE_WIZARD;
}

export interface StoreIssueRequest {
    type: typeof STORE_ISSUE_REQUEST;
    request: IssueRequest;
}

export interface AddIssueRequest {
    type: typeof ADD_ISSUE_REQUEST;
    request: IssueRequest;
}

export interface UpdateIssueRequest {
    type: typeof UPDATE_ISSUE_REQUEST;
    request: IssueRequest;
}

export interface UpdateAllIssueRequests {
    type: typeof UPDATE_ALL_ISSUE_REQUESTS;
    userDotAddress: string;
    issueRequests: IssueRequest[];
}

export type IssueActions =
    | ChangeIssueStep
    | ChangeIssueId
    | ResetIssueWizard
    | StoreIssueRequest
    | AddIssueRequest
    | UpdateIssueRequest
    | ChangeAddress
    | InitState
    | AddVaultIssues
    | UpdateAllIssueRequests
    | ChangeSelectedIssue;

// VAULT

export const ADD_REPLACE_REQUESTS = 'ADD_REPLACE_REQUESTS';
export const UPDATE_BTC_ADDRESS = 'UPDATE_BTC_ADDRESS';
export const UPDATE_COLLATERALIZATION = 'UPDATE_COLLATERALIZATION';
export const UPDATE_COLLATERAL = 'UPDATE_COLLATERAL';
export const UPDATE_LOCKED_BTC = 'UPDATE_LOCKED_BTC';
export const UPDATE_SLA = 'UPDATE_SLA';
export const UPDATE_PREMIUM_VAULT = 'UPDATE_PREMIUM_VAULT';
export const UPDATE_APY = 'UPDATE_APY';

export interface AddReplaceRequests {
    type: typeof ADD_REPLACE_REQUESTS;
    requests: VaultReplaceRequest[];
}

export interface UpdateBTCAddress {
    type: typeof UPDATE_BTC_ADDRESS;
    btcAddress: string;
}

export interface UpdateCollateralization {
    type: typeof UPDATE_COLLATERALIZATION;
    collateralization: string | undefined;
}

export interface UpdateCollateral {
    type: typeof UPDATE_COLLATERAL;
    collateral: string;
}

export interface UpdateLockedBTC {
    type: typeof UPDATE_LOCKED_BTC;
    lockedBTC: string;
}

export interface UpdateSLA {
    type: typeof UPDATE_SLA;
    sla: string;
}

export interface UpdatePremiumVault {
    type: typeof UPDATE_PREMIUM_VAULT;
    vault: Vault;
}

export interface UpdateAPY {
    type: typeof UPDATE_APY;
    apy: string;
}

export type VaultActions =
    | AddReplaceRequests
    | UpdateBTCAddress
    | UpdateCollateralization
    | UpdateCollateral
    | UpdateLockedBTC
    | UpdateSLA
    | UpdatePremiumVault
    | ResetRedeemWizard
    | InitState
    | UpdateAPY;
