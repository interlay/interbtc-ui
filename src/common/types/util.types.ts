import { Store, CombinedState } from "redux";
import { GeneralActions, RedeemActions, IssueActions, VaultActions } from "./actions.types";
import { rootReducer } from "../reducers/index";
import { u256 } from "@polkadot/types/primitive";
import { IssueState } from "./issue.types";
import { RedeemState } from "./redeem.types";
import { VaultState } from "./vault.types";
import { StatusCode } from "@interlay/polkabtc/build/interfaces/default";

export type Vault = {
    vaultId: string;
    btcAddress: string;
    lockedDOT: string;
    lockedBTC: string;
    pendingBTC: string;
    status: string;
    unsettledCollateralization: number | undefined;
    settledCollateralization: number | undefined;
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
    parachainHeight: number;
    bitcoinHeight: number;
    stateOfBTCParachain: StatusCode
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
