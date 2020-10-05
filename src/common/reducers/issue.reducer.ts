import {
    CHANGE_ISSUE_STEP,
    CHANGE_VAULT_BTC_ADDRESS,
    CHANGE_VAULT_DOT_ADDRESS,
    RESET_ISSUE_WIZARD,
    CHANGE_AMOUNT_BTC,
    CHANGE_FEE_BTC,
    CHANGE_BTC_TX_ID,
    CHANGE_ISSUE_ID,
    IssueActions,
} from "../types/actions.types";
import { Issue } from "../types/issue.types";

const initialState = {
    step: "ENTER_BTC_AMOUNT",
    amountBTC: "",
    feeBTC: "",
    vaultBtcAddress: "",
    vaultDotAddress: "",
    id: "",
    btcTxId: "",
};

export const issueReducer = (state: Issue = initialState, action: IssueActions): Issue => {
    switch (action.type) {
        case CHANGE_ISSUE_STEP:
            return { ...state, step: action.step };
        case CHANGE_AMOUNT_BTC:
            return { ...state, amountBTC: action.amount };
        case CHANGE_FEE_BTC:
            return { ...state, feeBTC: action.fee };
        case CHANGE_VAULT_BTC_ADDRESS:
            return { ...state, vaultBtcAddress: action.vaultBtcAddress };
        case CHANGE_VAULT_DOT_ADDRESS:
            return { ...state, vaultDotAddress: action.vaultDotAddress };
        case CHANGE_ISSUE_ID:
            return { ...state, id: action.id };
        case RESET_ISSUE_WIZARD:
            return initialState;
        case CHANGE_BTC_TX_ID:
            return { ...state, btcTxId: action.btcTxId };
        default:
            return state;
    }
};
