import {
    IS_POLKA_BTC_LOADED,
    IS_STAKED_RELAYER_LOADED,
    IS_VAULT_CLIENT_LOADED,
    SET_TOTAL_ISSUED_AND_TOTAL_LOCKED,
    SHOW_WALLET_PICKER_MODAL,
    CHANGE_ADDRESS,
    INIT_STATE,
    UPDATE_BALANCE_DOT,
    UPDATE_BALANCE_POLKA_BTC,
    GeneralActions,
    HAS_FEEDBACK_BEEN_DISPLAYED,
} from "../types/actions.types";
import { GeneralState } from "../types/util.types";

const initialState = {
    polkaBtcLoaded: false,
    relayerLoaded: false,
    vaultClientLoaded: false,
    hasFeedbackModalBeenDisplayed: false,
    showWalletPickerModal: false,
    address: "",
    totalPolkaBTC: "",
    totalLockedDOT: "",
    balancePolkaBTC: "",
    balanceDOT: "",
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
            return {
                ...state,
                polkaBtcLoaded: false,
                relayerLoaded: false,
                vaultClientLoaded: false,
                address: "",
                showWalletPickerModal: false,
            };
        case SET_TOTAL_ISSUED_AND_TOTAL_LOCKED:
            return { ...state, totalLockedDOT: action.totalLockedDOT, totalPolkaBTC: action.totalPolkaBTC };
        case IS_VAULT_CLIENT_LOADED:
            return { ...state, vaultClientLoaded: action.isLoaded };
        case HAS_FEEDBACK_BEEN_DISPLAYED:
            return { ...state, hasFeedbackModalBeenDisplayed: action.hasBeenDisplayed };
        case UPDATE_BALANCE_DOT:
            return { ...state, balanceDOT: action.balanceDOT };
        case UPDATE_BALANCE_POLKA_BTC:
            return { ...state, balancePolkaBTC: action.balancePolkaBTC };
        case SHOW_WALLET_PICKER_MODAL:
            return { ...state, showWalletPickerModal: action.showWalletPickerModal };
        default:
            return state;
    }
};
