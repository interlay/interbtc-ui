import {
    IS_POLKA_BTC_LOADED,
    IS_STAKED_RELAYER_LOADED,
    IS_VAULT_CLIENT_LOADED,
    SET_TOTAL_ISSUED_AND_TOTAL_LOCKED,
    CHANGE_ADDRESS,
    INIT_STATE,
    GeneralActions,
} from "../types/actions.types";
import { GeneralState } from "../types/util.types";

const initialState = {
    polkaBtcLoaded: false,
    relayerLoaded: false,
    vaultClientLoaded: false,
    address: "",
    totalPolkaBTC: "",
    totalLockedDOT: "",
};

export const generalReducer = (state: GeneralState = initialState, action: GeneralActions): GeneralState => {
    switch (action.type) {
        case IS_POLKA_BTC_LOADED:
            return { ...state, polkaBtcLoaded: action.isLoaded };
        case IS_STAKED_RELAYER_LOADED:
            return { ...state, relayerLoaded: action.isLoaded };
        case CHANGE_ADDRESS:
            return { ...state, address: action.address };
        case INIT_STATE:
            return { ...state, polkaBtcLoaded: false, relayerLoaded: false, vaultClientLoaded: false };
        case SET_TOTAL_ISSUED_AND_TOTAL_LOCKED:
            return { ...state, totalLockedDOT: action.totalLockedDOT, totalPolkaBTC: action.totalPolkaBTC };
        case IS_VAULT_CLIENT_LOADED:
            return { ...state, vaultClientLoaded: action.isLoaded };
        default:
            return state;
    }
};
