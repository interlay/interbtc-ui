import { Store, CombinedState } from "redux";
import { AddInstance, AddStakedRelayerInstance } from "./actions.types";
import { PolkaBTCAPI, StakedRelayerClient } from "@interlay/polkabtc";
import { rootReducer } from "../reducers/index";
import { u256 } from "@polkadot/types/primitive";
import Storage from "../controllers/storage";
import { Issue } from "./issue.types";
import { Redeem } from "./redeem.types";

export interface Prices {
    dotBtc: number;
    dotUsd: number;
}

export type Vault = {
    vaultId: string;
    btcAddress?: string;
    lockedDOT: string;
    lockedBTC: string;
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
    message: string;
    hasVoted: boolean;
}

export type AppState = ReturnType<typeof rootReducer>;

export type StoreType = {
    api: PolkaBTCAPI;
    relayer: StakedRelayerClient;
    prices: Prices;
    issue: Issue;
    redeem: Redeem;
    storage: Storage;
};

export type dispatcher = {
    // eslint-disable-next-line
    dispatch: {};
};

export type StoreState = Store<CombinedState<StoreType>, AddInstance | AddStakedRelayerInstance> & dispatcher;
