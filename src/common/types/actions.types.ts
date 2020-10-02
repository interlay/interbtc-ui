import { PolkaBTCAPI, StakedRelayerClient } from "@interlay/polkabtc";
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

// PRICES

export const UPDATE_PRICES = "UPDATE_PRICES";

export interface UpdatePrices {
    type: typeof UPDATE_PRICES;
    prices: Prices;
}

export type PricesActions = UpdatePrices;

// REDEEM

export const CHANGE_REEDEM_STEP = "CHANGE_REEDEM_STEP";
export const CHANGE_AMOUNT_POLKA_BTC = "CHANGE_AMOUNT_POLKA_BTC";
export const CHANGE_BTC_ADDRESS = "CHANGE_BTC_ADDRESS";
export const CHANGE_VAULT_BTC_ADDRESS = "CHANGE_VAULT_BTC_ADDRESS";
export const CHANGE_VAULT_DOT_ADDRESS = "CHANGE_VAULT_DOT_ADDRESS";
export const RESET_REDEEM_WIZARD = "RESET_REDEEM_WIZARD";

export interface ChangeRedeemStep {
    type: typeof CHANGE_REEDEM_STEP;
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

export interface ChangeVaultBtcAddress {
    type: typeof CHANGE_VAULT_BTC_ADDRESS;
    vaultBtcAddress: string;
}

export interface ChangeVaultDotAddress {
    type: typeof CHANGE_VAULT_DOT_ADDRESS;
    vaultDotAddress: string;
}

export interface ResetRedeemWizard {
    type: typeof RESET_REDEEM_WIZARD;
}

export type RedeemActions =
    | ChangeRedeemStep
    | ChangeAmountPolkaBtc
    | ChangeBtcAddress
    | ChangeVaultBtcAddress
    | ChangeVaultDotAddress
    | ResetRedeemWizard;
