import { Store, CombinedState } from "redux";
import { GeneralActions, RedeemActions, IssueActions, VaultActions } from "./actions.types";
import { rootReducer } from "../reducers/index";
import { u256 } from "@polkadot/types/primitive";
import { IssueState } from "./issue.types";
import { RedeemState } from "./redeem.types";
import { VaultState } from "./vault.types";

export interface StatusUpdate {
    id: u256;
    timestamp: string;
    proposedStatus: string;
    currentStatus: string;
    proposedChanges: string;
    blockHash: string;
    aye_vote_stake: string;
    nay_vote_stake: string;
    result: string;
    proposer: string;
    message: string;
}

export interface DashboardStatusUpdateInfo {
    id: string;
    timestamp: string;
    proposedStatus: string;
    addError: string;
    removeError: string;
    btc_block_hash: string;
    yeas: number;
    nays: number;
    executed: boolean;
    rejected: boolean;
    forced: boolean;
}

export enum ParachainStatus {
    Error,
    Running,
    Shutdown,
}

export enum ActiveTab {
    Issue,
    Redeem,
    Transfer,
}

export type Prices = {
    bitcoin: {
        usd: number;
    };
    polkadot: {
        usd: number;
    };
};

export type GeneralState = {
    polkaBtcLoaded: boolean;
    relayerLoaded: boolean;
    vaultClientLoaded: boolean;
    hasFeedbackModalBeenDisplayed: boolean;
    showAccountModal: boolean;
    address: string;
    totalPolkaBTC: string;
    totalLockedDOT: string;
    balancePolkaBTC: string;
    balanceDOT: string;
    extensions: string[];
    accounts: string[];
    btcRelayHeight: number;
    bitcoinHeight: number;
    stateOfBTCParachain: ParachainStatus;
    activeTab: ActiveTab;
    prices: Prices;
};

export type AppState = ReturnType<typeof rootReducer>;

export type StoreType = {
    general: GeneralState;
    issue: IssueState;
    redeem: RedeemState;
    vault: VaultState;
};

export type dispatcher = {
    // eslint-disable-next-line
    dispatch: {};
};

export type StoreState = Store<CombinedState<StoreType>, GeneralActions | RedeemActions | IssueActions | VaultActions> &
    dispatcher;

export type TimeDataPoint = {
    x: Date;
    y: number;
};

export type TableDisplayParams = {
    page: number;
    perPage: number;
    sortBy?: string;
    sortAsc?: boolean;
    searchFilter?: string;
};

export type RelayedBlock = {
    height: string;
    hash: string;
    relay_ts: string;
};
