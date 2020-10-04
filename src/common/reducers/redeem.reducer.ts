import {
    CHANGE_REDEEM_STEP,
    CHANGE_VAULT_BTC_ADDRESS,
    CHANGE_VAULT_DOT_ADDRESS,
    RESET_REDEEM_WIZARD,
    CHANGE_AMOUNT_POLKA_BTC,
    CHANGE_BTC_ADDRESS,
    CHANGE_REDEEM_ID,
    RedeemActions,
} from "../types/actions.types";
import { Redeem } from "../types/redeem.types";

const initialState = {
    step: "ENTER_POLKABTC",
    amountPolkaBTC: 0,
    btcAddress: "",
    vaultBtcAddress: "",
    vaultDotAddress: "",
    id: "",
};

export const redeemReducer = (state: Redeem = initialState, action: RedeemActions): Redeem => {
    switch (action.type) {
        case CHANGE_REDEEM_STEP:
            return { ...state, step: action.step };
        case CHANGE_AMOUNT_POLKA_BTC:
            return { ...state, amountPolkaBTC: action.amount };
        case CHANGE_BTC_ADDRESS:
            return { ...state, btcAddress: action.btcAddress };
        case CHANGE_VAULT_BTC_ADDRESS:
            return { ...state, vaultBtcAddress: action.vaultBtcAddress };
        case CHANGE_VAULT_DOT_ADDRESS:
            return { ...state, vaultDotAddress: action.vaultDotAddress };
        case CHANGE_REDEEM_ID:
            return { ...state, id: action.id };
        case RESET_REDEEM_WIZARD:
            return initialState;
        default:
            return state;
    }
};
