import { rootReducer } from "./common/reducers/index";
import { toast } from "react-toastify";
import { AppState, StoreType, StoreState } from "./common/types/util.types";
import { createLogger } from "redux-logger";
import { applyMiddleware, createStore } from "redux";
import { initializeState } from "./common/actions/general.actions";
import { PolkaBTCAPI, StakedRelayerClient, VaultClient } from "@interlay/polkabtc";
import { mapToArray, arrayToMap } from "./common/utils/utils";

declare global {
    interface Window {
        polkaBTC: PolkaBTCAPI;
        relayer: StakedRelayerClient;
        vaultClient: VaultClient;
    }
}

export const getInitialState = (): StoreType => {
    const emptyStore: StoreType = {
        general: {
            polkaBtcLoaded: false,
            relayerLoaded: false,
            vaultClientLoaded: false,
            address: "",
            totalLockedDOT: "",
            totalPolkaBTC: "",
            balancePolkaBTC: "",
            balanceDOT: "",
        },
        issue: {
            address: "",
            step: "ENTER_BTC_AMOUNT",
            amountBTC: "",
            feeBTC: "0",
            vaultBtcAddress: "",
            vaultDotAddress: "",
            id: "",
            btcTxId: "",
            issueRequests: new Map(),
            transactionListeners: [],
            wizardInEditMode: false,
            vaultIssues: [],
        },
        redeem: {
            address: "",
            step: "ENTER_POLKABTC",
            amountPolkaBTC: "",
            btcAddress: "",
            vaultBtcAddress: "",
            vaultDotAddress: "",
            transactionListeners: [],
            id: "",
            redeemRequests: new Map(),
            vaultRedeems: [],
        },
        vault: {
            requests: [],
            btcAddress: "",
            collateralization: undefined,
            collateral: "",
            lockedBTC: "",
        },
    };
    return emptyStore;
};

export const loadState = (): StoreType => {
    try {
        const serializedState = localStorage.getItem("pbtc-store-1");
        if (serializedState === null) {
            const initialState = getInitialState();
            return initialState;
        }
        const rawStore = JSON.parse(serializedState);
        const deserializedState = {
            ...rawStore,
            general: {
                ...rawStore.general,
                polkaBtcLoaded: false,
                relayerLoaded: false,
            },
        };
        return {
            ...deserializedState,
            issue: {
                ...deserializedState.issue,
                issueRequests: arrayToMap(deserializedState.issue.issueRequests),
            },
            redeem: {
                ...deserializedState.redeem,
                redeemRequests: arrayToMap(deserializedState.redeem.redeemRequests),
            },
        };
    } catch (error) {
        setTimeout(
            () => toast.error("Local storage is disabled. In order to use platform please enable local storage"),
            2000
        );
        const initialState = getInitialState();
        return initialState;
    }
};

export const saveState = (store: AppState): void => {
    try {
        const preperedState = {
            ...store,
            issue: {
                ...store.issue,
                issueRequests: mapToArray(store.issue.issueRequests),
            },
            redeem: {
                ...store.redeem,
                redeemRequests: mapToArray(store.redeem.redeemRequests),
            },
        };
        const serializedState = JSON.stringify(preperedState);
        localStorage.setItem("pbtc-store-1", serializedState);
    } catch (error) {
        setTimeout(
            () => toast.error("Local storage is disabled. In order to use platform please enable local storage"),
            2000
        );
    }
};

export const configureStore = (): StoreState => {
    const storeLogger = createLogger();
    const state = loadState();
    const store = createStore(rootReducer, state, applyMiddleware(storeLogger));
    store.dispatch(initializeState(state));
    store.subscribe(() => {
        saveState(store.getState());
    });
    return store;
};
