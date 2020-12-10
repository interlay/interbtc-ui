import {
    ADD_REPLACE_REQUESTS,
    UPDATE_COLLATERALIZATION,
    UPDATE_BTC_ADDRESS,
    UPDATE_COLLATERAL,
    UPDATE_LOCKED_BTC,
    UPDATE_SLA,
    VaultActions,
} from "../types/actions.types";
import { VaultState } from "../types/vault.types";

const initialState = {
    requests: [],
    btcAddress: "",
    collateralization: 0,
    collateral: "",
    lockedBTC: "",
    sla: 0,
};

export const vaultReducer = (state: VaultState = initialState, action: VaultActions): VaultState => {
    switch (action.type) {
        case ADD_REPLACE_REQUESTS:
            return { ...state, requests: action.requests };
        case UPDATE_COLLATERALIZATION:
            return { ...state, collateralization: action.collateralization };
        case UPDATE_BTC_ADDRESS:
            return { ...state, btcAddress: action.btcAddress };
        case UPDATE_COLLATERAL:
            return { ...state, collateral: action.collateral };
        case UPDATE_LOCKED_BTC:
            return { ...state, lockedBTC: action.lockedBTC };
        case UPDATE_SLA:
            return { ...state, sla: action.sla };
        default:
            return state;
    }
};
