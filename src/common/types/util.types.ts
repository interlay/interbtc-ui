import { Store, CombinedState } from "redux";
import { AddInstance, AddStakedRelayerInstance } from "./actions.types";
import { PolkaBTCAPI, StakedRelayerClient } from "@interlay/polkabtc";
import { rootReducer } from "../reducers/index";

export interface Redeem {
    step: string;
    amountPolkaBTC: number;
    btcAddress: string;
    vaultDotAddress: string;
    vaultBtcAddress: string;
}

export interface Prices {
    dotBtc: number;
    dotUsd: number;
}

export type Vault = {
    vaultId: string;
    btcAddress: string;
    lockedDOT: number;
    lockedBTC: number;
    status: string;
    collateralization: number;
};

export type AppState = ReturnType<typeof rootReducer>;

export type StoreType = {
    api: PolkaBTCAPI;
    relayer: StakedRelayerClient;
    prices: Prices;
    redeem: Redeem;
};

export type dispatcher = {
    // eslint-disable-next-line
    dispatch: {};
};

export type StoreState = Store<CombinedState<StoreType>, AddInstance | AddStakedRelayerInstance> & dispatcher;
