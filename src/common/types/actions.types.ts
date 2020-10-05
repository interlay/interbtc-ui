import { PolkaBTCAPI, StakedRelayerClient } from "@interlay/polkabtc";
import Storage from "../controllers/storage";
import { IssueRequest } from "./issue.types";
import { RedeemRequest } from "./redeem.types";
import { Prices } from "./util.types";

// API ACTIONS

export const ADD_INSTANCE = "ADD_INSTANCE";
export const ADD_STAKED_RELAYER_INSTANCE = "ADD_STAKED_RELAYER_INSTANCE";

export interface AddInstance {
    type: typeof ADD_INSTANCE;
    polkaBtc: PolkaBTCAPI;
}

export interface AddStakedRelayerInstance {
    type: typeof ADD_STAKED_RELAYER_INSTANCE;
    stakedRelayer: StakedRelayerClient;
}

export type ApiActions = AddInstance | AddStakedRelayerInstance;

// STORAGE

export const ADD_STORAGE = "ADD_STORAGE";

export interface AddStorage {
    type: typeof ADD_STORAGE;
    storage: Storage;
}

export type StorageActions = AddStorage;

// PRICES

export const UPDATE_PRICES = "UPDATE_PRICES";

export interface UpdatePrices {
    type: typeof UPDATE_PRICES;
    prices: Prices;
}

export type PricesActions = UpdatePrices;

// COMMON ISSUE AND REDEEM

export const CHANGE_VAULT_BTC_ADDRESS = "CHANGE_VAULT_BTC_ADDRESS";
export const CHANGE_VAULT_DOT_ADDRESS = "CHANGE_VAULT_DOT_ADDRESS";

export interface ChangeVaultBtcAddress {
    type: typeof CHANGE_VAULT_BTC_ADDRESS;
    vaultBtcAddress: string;
}

export interface ChangeVaultDotAddress {
    type: typeof CHANGE_VAULT_DOT_ADDRESS;
    vaultDotAddress: string;
}

// REDEEM

export const CHANGE_REDEEM_STEP = "CHANGE_REDEEM_STEP";
export const CHANGE_AMOUNT_POLKA_BTC = "CHANGE_AMOUNT_POLKA_BTC";
export const CHANGE_BTC_ADDRESS = "CHANGE_BTC_ADDRESS";
export const CHANGE_REDEEM_ID = "CHANGE_REDEEM_ID";
export const RESET_REDEEM_WIZARD = "RESET_REDEEM_WIZARD";
export const STORE_REDEEM_REQUEST = "STORE_REDEEM_REQUEST";

export interface ChangeRedeemStep {
    type: typeof CHANGE_REDEEM_STEP;
    step: string;
}

export interface ChangeAmountPolkaBtc {
    type: typeof CHANGE_AMOUNT_POLKA_BTC;
    amount: number;
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

export interface StoreRedeemRequest {
    type: typeof STORE_REDEEM_REQUEST;
    request: RedeemRequest;
}

export type RedeemActions =
    | ChangeRedeemStep
    | ChangeAmountPolkaBtc
    | ChangeBtcAddress
    | ChangeVaultBtcAddress
    | ChangeVaultDotAddress
    | ChangeRedeemId
    | ResetRedeemWizard
    | StoreRedeemRequest;

// ISSUE

export const CHANGE_ISSUE_STEP = "CHANGE_ISSUE_STEP";
export const CHANGE_AMOUNT_BTC = "CHANGE_AMOUNT_BTC";
export const CHANGE_FEE_BTC = "CHANGE_FEE_BTC";
export const CHANGE_ISSUE_ID = "CHANGE_ISSUE_ID";
export const RESET_ISSUE_WIZARD = "RESET_ISSUE_WIZARD";
export const STORE_ISSUE_REQUEST = "STORE_ISSUE_REQUEST";
export const CHANGE_BTC_TX_ID = "CHANGE_BTC_TX_ID";
export const ADD_ISSUE_REQUEST = "ADD_ISSUE_REQUEST";
export const UPDATE_ISSUE_REQUEST = "UPDATE_ISSUE_REQUEST";
export const ADD_TRANSACTION_LISTENER = "ADD_TRANSACTION_LISTENER";
export const ADD_PROOF_LISTENER = "ADD_PROOF_LISTENER";

export interface ChangeIssueStep {
    type: typeof CHANGE_ISSUE_STEP;
    step: string;
}

export interface ChangeAmountBtc {
    type: typeof CHANGE_AMOUNT_BTC;
    amount: number;
}

export interface ChangeFeeBtc {
    type: typeof CHANGE_FEE_BTC;
    fee: number;
}

export interface ChangeBtcAddress {
    type: typeof CHANGE_BTC_ADDRESS;
    btcAddress: string;
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

export interface AddTransactionListener {
    type: typeof ADD_TRANSACTION_LISTENER;
    id: string;
}

export interface AddProofListener {
    type: typeof ADD_PROOF_LISTENER;
    id: string;
}

export type IssueActions =
    | ChangeIssueStep
    | ChangeAmountBtc
    | ChangeFeeBtc
    | ChangeBtcAddress
    | ChangeVaultBtcAddress
    | ChangeVaultDotAddress
    | ChangeIssueId
    | ChangeBtcTxId
    | ResetIssueWizard
    | StoreIssueRequest
    | AddIssueRequest
    | UpdateIssueRequest
    | AddTransactionListener
    | AddProofListener;
