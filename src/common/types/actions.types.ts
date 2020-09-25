import { PolkaBTCAPI } from "@interlay/polkabtc";
import { Prices } from "./util.types";

// API ACTIONS

export const ADD_INSTANCE = "ADD_INSTANCE";

export interface AddInstance{
    type: typeof ADD_INSTANCE;
    polkaBtc: PolkaBTCAPI;
}

export type ApiActions = AddInstance;

// PRICES

export const UPDATE_PRICES = "UPDATE_PRICES";

export interface UpdatePrices {
    type: typeof UPDATE_PRICES;
    prices: Prices;
}

export type PricesActions = UpdatePrices;