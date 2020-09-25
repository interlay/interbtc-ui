import { Store, CombinedState } from "redux";
import { AddInstance } from "./actions.types";
import { PolkaBTCAPI } from "@interlay/polkabtc";
import { rootReducer } from "../reducers/index";

export type AppState = ReturnType<typeof rootReducer>

export type StoreType = {
    api: PolkaBTCAPI;
}

export type dispatcher = {
    // eslint-disable-next-line
    dispatch: {}; 
}

export type StoreState = Store<CombinedState<StoreType>, AddInstance> 
& dispatcher;
