import { PolkaBTCAPI } from "@interlay/polkabtc";

// API ACTIONS

export const ADD_INSTANCE = "ADD_INSTANCE";

export interface AddInstance{
    type: typeof ADD_INSTANCE;
    polkaBtc: PolkaBTCAPI;
}

export type ApiActions = AddInstance;
