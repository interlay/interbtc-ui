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
