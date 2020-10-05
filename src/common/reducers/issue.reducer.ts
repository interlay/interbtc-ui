import {
    CHANGE_ISSUE_STEP,
    CHANGE_VAULT_BTC_ADDRESS,
    CHANGE_VAULT_DOT_ADDRESS,
    RESET_ISSUE_WIZARD,
    CHANGE_AMOUNT_BTC,
    CHANGE_FEE_BTC,
    CHANGE_BTC_TX_ID,
    CHANGE_ISSUE_ID,
    ADD_ISSUE_REQUEST,
    UPDATE_ISSUE_REQUEST,
    IssueActions,
    ADD_PROOF_LISTENER,
    ADD_TRANSACTION_LISTENER,
} from "../types/actions.types";
import { Issue, IssueRequest } from "../types/issue.types";

const initialState = {
    step: "ENTER_BTC_AMOUNT",
    amountBTC: 0,
    feeBTC: 0,
    vaultBtcAddress: "",
    vaultDotAddress: "",
    id: "",
    btcTxId: "",
    issueRequests: [],
    transactionListeners: [],
    proofListeners: [],
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
            let newState = {
                ...initialState, 
                issueRequests: state.issueRequests,
                transactionListeners: state.transactionListeners,
                proofListeners: state.proofListeners
            };
            return newState;
        case ADD_ISSUE_REQUEST:
            let issueRequests = [action.request];
            if (state.issueRequests){
                issueRequests = [...state.issueRequests,...issueRequests];
            }
            return {...state, issueRequests};
        case UPDATE_ISSUE_REQUEST:
            const updatedRequests = state.issueRequests.map((issue: IssueRequest) => {
                return issue.id === action.request.id ? action.request : issue;
            });
            return {...state, issueRequests: updatedRequests};
        case CHANGE_BTC_TX_ID:
            return { ...state, btcTxId: action.btcTxId };
        case ADD_PROOF_LISTENER:
            if (state.proofListeners.indexOf(action.id) !== -1) return state;
            return { ...state, proofListeners: [...state.proofListeners, action.id]};
        case ADD_TRANSACTION_LISTENER: 
            if (state.transactionListeners.indexOf(action.id) !== -1) return state;
            return { ...state, transactionListeners: [...state.transactionListeners, action.id]};
        default:
            return state;
    }
};
