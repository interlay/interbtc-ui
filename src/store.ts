import { rootReducer } from "./common/reducers/index";
import { toast } from "react-toastify";
import Storage from "./common/controllers/storage";
import { AppState, StoreType, StoreState } from "./common/types/util.types";
import { createLogger } from "redux-logger";
import { applyMiddleware, createStore } from "redux";

export const getInitialState = (): StoreType => {
    const emptyStore: StoreType = {
        api: null,
        relayer: null,
        prices: { dotBtc: 0, dotUsd: 0 },
        issue: {
            step: "ENTER_BTC_AMOUNT",
            amountBTC: "",
            feeBTC: "0",
            vaultBtcAddress: "",
            vaultDotAddress: "",
            id: "",
            btcTxId: "",
            issueRequests: [],
            transactionListeners: [],
            proofListeners: [],
            wizardInEditMode: false,
        },
        redeem: {
            step: "ENTER_POLKABTC",
            amountPolkaBTC: "",
            btcAddress: "",
            vaultBtcAddress: "",
            vaultDotAddress: "",
            id: "",
        },
        storage: new Storage(),
    };
    return emptyStore;
};

export const loadState = (): StoreType => {
    try {
        const serializedState = localStorage.getItem("store");
        if (serializedState === null) {
            const initialState = getInitialState();
            return initialState;
        }
        return JSON.parse(serializedState);
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
        const serializedState = JSON.stringify(store);
        localStorage.setItem("store", serializedState);
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
    store.subscribe(() => {
        saveState(store.getState());
    });
    return store;
};
