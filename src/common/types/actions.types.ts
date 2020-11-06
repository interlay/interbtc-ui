import { IssueRequest, VaultIssue } from "./issue.types";
import { RedeemRequest, VaultRedeem } from "./redeem.types";
import { VaultReplaceRequest } from "./vault.types";
import { StoreType } from "./util.types";

// GENERAL ACTIONS

export const IS_POLKA_BTC_LOADED = "IS_POLKA_BTC_LOADED";
export const IS_STAKED_RELAYER_LOADED = "IS_STAKED_RELAYER_LOADED";
export const IS_VAULT_CLIENT_LOADED = "IS_VAULT_CLIENT_LOADED";
export const INIT_STATE = "INIT_STATE";
export const CHANGE_ADDRESS = "CHANGE_ADDRESS";
export const SET_TOTAL_ISSUED_AND_TOTAL_LOCKED = "SET_TOTAL_ISSUED_AND_TOTAL_LOCKED";

export interface IsPolkaBtcLoaded {
    type: typeof IS_POLKA_BTC_LOADED;
    isLoaded: boolean;
}

export interface IsStakedRelayerLoaded {
    type: typeof IS_STAKED_RELAYER_LOADED;
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

export interface SetTotalIssuedAndTotalLocked {
    type: typeof SET_TOTAL_ISSUED_AND_TOTAL_LOCKED;
    totalPolkaBTC: string;
    totalLockedDOT: string;
}

export type GeneralActions =
    | IsPolkaBtcLoaded
    | IsStakedRelayerLoaded
    | ChangeAddress
    | InitState
    | SetTotalIssuedAndTotalLocked
    | IsVaultClientLoaded;

// REDEEM

export const CHANGE_VAULT_BTC_ADDRESS_ON_REDEEM = "CHANGE_VAULT_BTC_ADDRESS_ON_REDEEM";
export const CHANGE_VAULT_DOT_ADDRESS_ON_REDEEM = "CHANGE_VAULT_DOT_ADDRESS_ON_REDEEM";
export const CHANGE_REDEEM_STEP = "CHANGE_REDEEM_STEP";
export const CHANGE_AMOUNT_POLKA_BTC = "CHANGE_AMOUNT_POLKA_BTC";
export const CHANGE_BTC_ADDRESS = "CHANGE_BTC_ADDRESS";
export const CHANGE_REDEEM_ID = "CHANGE_REDEEM_ID";
export const SET_REDEEM_REQUESTS = "SET_REDEEM_REQUESTS";
export const RESET_REDEEM_WIZARD = "RESET_REDEEM_WIZARD";
export const STORE_REDEEM_REQUEST = "STORE_REDEEM_REQUEST";
export const ADD_REDEEM_REQUEST = "ADD_REDEEM_REQUEST";
export const ADD_VAULT_REDEEMS = "ADD_VAULT_REDEEMS";
export const ADD_TRANSACTION_LISTENER_REDEEM = "ADD_TRANSACTION_LISTENER_REDEEM";

export interface ChangeVaultBtcAddressOnRedeem {
    type: typeof CHANGE_VAULT_BTC_ADDRESS_ON_REDEEM;
    vaultBtcAddress: string;
}

export interface ChangeVaultDotAddressOnRedeem {
    type: typeof CHANGE_VAULT_DOT_ADDRESS_ON_REDEEM;
    vaultDotAddress: string;
}

export interface ChangeRedeemStep {
    type: typeof CHANGE_REDEEM_STEP;
    step: string;
}

export interface ChangeAmountPolkaBtc {
    type: typeof CHANGE_AMOUNT_POLKA_BTC;
    amount: string;
}

export interface ChangeBtcAddress {
    type: typeof CHANGE_BTC_ADDRESS;
    btcAddress: string;
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

export interface AddTransactionListenerRedeem {
    type: typeof ADD_TRANSACTION_LISTENER_REDEEM;
    id: string;
}

export type RedeemActions =
    | ChangeRedeemStep
    | ChangeAmountPolkaBtc
    | ChangeBtcAddress
    | ChangeVaultBtcAddressOnRedeem
    | ChangeVaultDotAddressOnRedeem
    | ChangeRedeemId
    | ResetRedeemWizard
    | SetRedeemRequests
    | StoreRedeemRequest
    | AddRedeemRequest
    | ChangeAddress
    | InitState
    | AddVaultRedeems
    | AddTransactionListenerRedeem;

// ISSUE

export const CHANGE_VAULT_BTC_ADDRESS_ON_ISSUE = "CHANGE_VAULT_BTC_ADDRESS_ON_ISSUE";
export const CHANGE_VAULT_DOT_ADDRESS_ON_ISSUE = "CHANGE_VAULT_DOT_ADDRESS_ON_ISSUE";
export const CHANGE_ISSUE_STEP = "CHANGE_ISSUE_STEP";
export const CHANGE_AMOUNT_BTC = "CHANGE_AMOUNT_BTC";
export const CHANGE_FEE_BTC = "CHANGE_FEE_BTC";
export const CHANGE_ISSUE_ID = "CHANGE_ISSUE_ID";
export const RESET_ISSUE_WIZARD = "RESET_ISSUE_WIZARD";
export const STORE_ISSUE_REQUEST = "STORE_ISSUE_REQUEST";
export const CHANGE_BTC_TX_ID = "CHANGE_BTC_TX_ID";
export const ADD_ISSUE_REQUEST = "ADD_ISSUE_REQUEST";
export const UPDATE_ISSUE_REQUEST = "UPDATE_ISSUE_REQUEST";
export const ADD_TRANSACTION_LISTENER_ISSUE = "ADD_TRANSACTION_LISTENER_ISSUE";
export const OPEN_WIZARD_IN_EDIT_MODE = "OPEN_WIZARD_IN_EDIT_MODE";
export const ADD_VAULT_ISSUES = "ADD_VAULT_ISSUES";

export interface AddVaultIssues {
    type: typeof ADD_VAULT_ISSUES;
    vaultIssues: VaultIssue[];
}

export interface ChangeVaultBtcAddressOnIssue {
    type: typeof CHANGE_VAULT_BTC_ADDRESS_ON_ISSUE;
    vaultBtcAddress: string;
}

export interface ChangeVaultDotAddressOnIssue {
    type: typeof CHANGE_VAULT_DOT_ADDRESS_ON_ISSUE;
    vaultDotAddress: string;
}

export interface ChangeIssueStep {
    type: typeof CHANGE_ISSUE_STEP;
    step: string;
}

export interface ChangeAmountBtc {
    type: typeof CHANGE_AMOUNT_BTC;
    amount: string;
}

export interface ChangeFeeBtc {
    type: typeof CHANGE_FEE_BTC;
    fee: string;
}

export interface ChangeIssueId {
    type: typeof CHANGE_ISSUE_ID;
    id: string;
}

export interface ChangeBtcTxId {
    type: typeof CHANGE_BTC_TX_ID;
    btcTxId: string;
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

export interface AddTransactionListenerIssue {
    type: typeof ADD_TRANSACTION_LISTENER_ISSUE;
    id: string;
}

export interface OpenWizardInEditMode {
    type: typeof OPEN_WIZARD_IN_EDIT_MODE;
}

export type IssueActions =
    | ChangeIssueStep
    | ChangeAmountBtc
    | ChangeFeeBtc
    | ChangeVaultBtcAddressOnIssue
    | ChangeVaultDotAddressOnIssue
    | ChangeIssueId
    | ChangeBtcTxId
    | ResetIssueWizard
    | StoreIssueRequest
    | AddIssueRequest
    | UpdateIssueRequest
    | AddTransactionListenerIssue
    | OpenWizardInEditMode
    | ChangeAddress
    | InitState
    | AddVaultIssues;

// VAULT

export const ADD_REPLACE_REQUESTS = "ADD_REPLACE_REQUESTS";
export const ADD_REPLACE_REQUEST = "ADD_REPLACE_REQUEST";
export const REQUEST_REPLACMENT_PENDING = "REQUEST_REPLACMENT_PENDING";
export const UPDATE_BTC_ADDRESS = "UPDATE_BTC_ADDRESS";
export const UPDATE_COLLATERALIZATION = "UPDATE_COLLATERALIZATION";
export const UPDATE_COLLATERAL = "UPDATE_COLLATERAL";
export const UPDATE_LOCKED_BTC = "UPDATE_LOCKED_BTC";

export interface AddReplaceRequests {
    type: typeof ADD_REPLACE_REQUESTS;
    requests: VaultReplaceRequest[];
}

export interface AddReplaceRequest {
    type: typeof ADD_REPLACE_REQUEST;
    request: VaultReplaceRequest;
}

export interface RequestReplacmentPending {
    type: typeof REQUEST_REPLACMENT_PENDING;
    isReplacmentPending: boolean;
}

export interface UpdateBTCAddress {
    type: typeof UPDATE_BTC_ADDRESS;
    btcAddress: string;
}

export interface UpdateCollateralization {
    type: typeof UPDATE_COLLATERALIZATION;
    collateralization: number;
}

export interface UpdateCollateral {
    type: typeof UPDATE_COLLATERAL;
    collateral: string;
}

export interface UpdateLockedBTC {
    type: typeof UPDATE_LOCKED_BTC;
    lockedBTC: string;
}

export type VaultActions =
    | AddReplaceRequests
    | AddReplaceRequest
    | RequestReplacmentPending
    | UpdateBTCAddress
    | UpdateCollateralization
    | UpdateCollateral
    | UpdateLockedBTC;
