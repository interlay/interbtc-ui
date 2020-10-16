import { rootReducer } from "./common/reducers/index";
import { toast } from "react-toastify";
import { AppState, StoreType, StoreState } from "./common/types/util.types";
import { createLogger } from "redux-logger";
import { applyMiddleware, createStore } from "redux";
import { initializeState } from "./common/actions/general.actions";
import { PolkaBTCAPI, StakedRelayerClient } from "@interlay/polkabtc";
import { mapToArray, arrayToMap } from "./common/utils/utils";

declare global {
    interface Window { 
        polkaBTC: PolkaBTCAPI; 
        relayer: StakedRelayerClient;
    }
}
  
export const getInitialState = (): StoreType => {
    const emptyStore: StoreType = {
        general: {
            polkaBtcLoaded: false,
            relayerLoaded: false,
            address: ""
        },
        prices: { dotBtc: 0, dotUsd: 0 },
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
            proofListeners: [],
            wizardInEditMode: false,
        },
        redeem: {
            address: "",
            step: "ENTER_POLKABTC",
            amountPolkaBTC: "",
            btcAddress: "",
            vaultBtcAddress: "",
            vaultDotAddress: "",
            id: "",
            redeemRequests: new Map()
        }
    };
    return emptyStore;
};

export const loadState = (): StoreType => {
    try {
        const serializedState = localStorage.getItem("pbtc-store");
        if (serializedState === null) {
            const initialState = getInitialState();
            return initialState;
        }
        let rawStore = JSON.parse(serializedState);
        let deserializedState = {
            ...rawStore, 
            general: {
                polkaBtcLoaded: false, 
                relayerLoaded: false,
                address: rawStore.general.address
            }
        };
        return {
            ...deserializedState,
            issue: {
                ...deserializedState.issue,
                issueRequests: arrayToMap(deserializedState.issue.issueRequests)
            },
            redeem: {
                ...deserializedState.redeem,
                redeemRequests: arrayToMap(deserializedState.redeem.redeemRequests)
            }
        }
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
                issueRequests: mapToArray(store.issue.issueRequests)
            },
            redeem: {
                ...store.redeem,
                redeemRequests: mapToArray(store.redeem.redeemRequests)
            }
        };
        const serializedState = JSON.stringify(preperedState);
        localStorage.setItem("pbtc-store", serializedState);
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
