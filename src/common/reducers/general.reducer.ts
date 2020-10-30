import {
    IS_POLKA_BTC_LOADED,
    IS_STAKED_RELAYER_LOADED,
    SET_TOTAL_ISSUED_AND_TOTAL_LOCKED,
    CHANGE_ADDRESS,
    INIT_STATE,
    GeneralActions,
    UPDATE_COLLATERAL,
    UPDATE_BTC_ADDRESS,
} from "../types/actions.types";
import { GeneralType } from "../types/util.types";

const initialState = {
    polkaBtcLoaded: false,
    relayerLoaded: false,
    address: "",
    totalPolkaBTC: "",
    totalLockedDOT: "",
    btcAddress: "",
    collateral: 0,
};

export const generalReducer = (state: GeneralType = initialState, action: GeneralActions): GeneralType => {
    switch (action.type) {
        case IS_POLKA_BTC_LOADED:
            return { ...state, polkaBtcLoaded: action.isLoaded };
        case IS_STAKED_RELAYER_LOADED:
            return { ...state, relayerLoaded: action.isLoaded };
        case CHANGE_ADDRESS:
            return { ...state, address: action.address };
        case INIT_STATE:
            return { ...state, polkaBtcLoaded: false, relayerLoaded: false };
        case SET_TOTAL_ISSUED_AND_TOTAL_LOCKED:
            return { ...state, totalLockedDOT: action.totalLockedDOT, totalPolkaBTC: action.totalPolkaBTC };
        case UPDATE_COLLATERAL:
            return { ...state, collateral: action.collateral };
        case UPDATE_BTC_ADDRESS:
            return { ...state, btcAddress: action.btcAddress };
        default:
            return state;
    }
};
