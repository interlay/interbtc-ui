import { Store, CombinedState } from "redux";
import { AddInstance } from "./actions.types";
import { PolkaBTCAPI } from "@interlay/polkabtc";
import { rootReducer } from "../reducers/index";

export interface Prices {
    dotBtc: number;
    dotUsd: number;
}

export type Vault = {
    id: string;
    vault: string;	
    btcAddress: string;
    lockedDOT: number;
    lockedBTC: number;
    collateralization: number;
}

export type AppState = ReturnType<typeof rootReducer>

export type StoreType = {
    api: PolkaBTCAPI;
    prices: Prices;
}

export type dispatcher = {
    // eslint-disable-next-line
    dispatch: {}; 
}

export type StoreState = Store<CombinedState<StoreType>, AddInstance> 
& dispatcher;
