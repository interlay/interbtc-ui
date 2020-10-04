import { Store, CombinedState } from "redux";
import { AddInstance, AddStakedRelayerInstance } from "./actions.types";
import { PolkaBTCAPI, StakedRelayerClient } from "@interlay/polkabtc";
import { rootReducer } from "../reducers/index";
import { PolkaBTC } from "@interlay/polkabtc/build/interfaces/default";
import { u256 } from "@polkadot/types/primitive";
import Storage from "../controllers/storage";

export interface Redeem {
    step: string;
    amountPolkaBTC: number;
    btcAddress: string;
    vaultDotAddress: string;
    vaultBtcAddress: string;
    id: string;
}

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

export interface StatusUpdate {
    id: u256;
    timestamp: string;
    proposedStatus: string;
    currentStatus: string;
    proposedChanges: string;
    blockHash: string;
    votes: string;
    result: string;
    proposer: string;
}

export type AppState = ReturnType<typeof rootReducer>;

export type StoreType = {
    api: PolkaBTCAPI;
    relayer: StakedRelayerClient;
    prices: Prices;
    redeem: Redeem;
    storage: Storage;
};

export type dispatcher = {
    // eslint-disable-next-line
    dispatch: {};
};

export type StoreState = Store<CombinedState<StoreType>, AddInstance | AddStakedRelayerInstance> & dispatcher;
