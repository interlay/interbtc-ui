import {
    ADD_REPLACE_REQUESTS,
    ADD_REPLACE_REQUEST,
    REQUEST_REPLACMENT_PENDING,
    UPDATE_COLLATERALIZATION,
    UPDATE_BTC_ADDRESS,
    UPDATE_COLLATERAL,
    UPDATE_LOCKED_BTC,
    VaultActions,
} from "../types/actions.types";
import { VaultState } from "../types/vault.types";

const initialState = {
    requests: [],
    isReplacmentPending: false,
    btcAddress: "",
    collateralization: 0,
    collateral: 0,
    lockedBTC: 0,
};

export const vaultReducer = (state: VaultState = initialState, action: VaultActions): VaultState => {
    switch (action.type) {
        case ADD_REPLACE_REQUESTS:
            return { ...state, requests: action.requests };
        case ADD_REPLACE_REQUEST:
            return { ...state, requests: [...state.requests, action.request] };
        case REQUEST_REPLACMENT_PENDING:
            return { ...state, isReplacmentPending: action.isReplacmentPending };
        case UPDATE_COLLATERALIZATION:
            return { ...state, collateralization: action.collateralization };
        case UPDATE_BTC_ADDRESS:
            return { ...state, btcAddress: action.btcAddress };
        case UPDATE_COLLATERAL:
            return { ...state, collateral: action.collateral };
        case UPDATE_LOCKED_BTC:
            return { ...state, lockedBTC: action.lockedBTC };
        default:
            return state;
    }
};
