import { Store, CombinedState } from "redux";
import { AddInstance, AddStakedRelayerInstance } from "./actions.types";
import { PolkaBTCAPI, StakedRelayerClient } from "@interlay/polkabtc";
import { rootReducer } from "../reducers/index";
import { DOT, PolkaBTC } from "@interlay/polkabtc/build/interfaces/default";

export interface Prices {
    dotBtc: number;
    dotUsd: number;
}

export type Vault = {
    vaultId: string;
    btcAddress: string;
    lockedDOT: number;
    lockedBTC: PolkaBTC;
    status: string;
    collateralization: number | undefined;
};

export type AppState = ReturnType<typeof rootReducer>;

export type StoreType = {
    api: PolkaBTCAPI;
    relayer: StakedRelayerClient;
    prices: Prices;
};

export type dispatcher = {
    // eslint-disable-next-line
    dispatch: {};
};

export type StoreState = Store<CombinedState<StoreType>, AddInstance | AddStakedRelayerInstance> & dispatcher;
