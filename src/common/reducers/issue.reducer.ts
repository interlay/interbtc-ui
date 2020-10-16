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
    CHANGE_ADDRESS,
    IssueActions,
    ADD_PROOF_LISTENER,
    ADD_TRANSACTION_LISTENER,
    OPEN_WIZARD_IN_EDIT_MODE,
    INIT_STATE,
} from "../types/actions.types";
import { Issue } from "../types/issue.types";

const initialState = {
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
};

export const issueReducer = (state: Issue = initialState, action: IssueActions): Issue => {
    switch (action.type) {
        case CHANGE_ADDRESS:
            return { ...state, address: action.address };
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
            const newState = {
                ...initialState,
                address: state.address,
                issueRequests: state.issueRequests,
                transactionListeners: state.transactionListeners,
                proofListeners: state.proofListeners,
            };
            return newState;
        case ADD_ISSUE_REQUEST:
            const newMap = new Map(state.issueRequests);
            const requests = state.issueRequests.get(state.address);
            if (requests) {
                newMap.set(state.address, [...requests, action.request]);
            } else {
                newMap.set(state.address, [action.request]);
            }
            return { ...state, issueRequests: newMap };
        case UPDATE_ISSUE_REQUEST:
            const map = new Map(state.issueRequests);
            const reqs = state.issueRequests.get(state.address);
            if (!reqs) return state;
            const updateRequests = reqs.map((request) => {
                if (action.request.id !== request.id) return request;
                else return action.request;
            });
            map.set(state.address, updateRequests);
            return { ...state, issueRequests: map };
        case CHANGE_BTC_TX_ID:
            return { ...state, btcTxId: action.btcTxId };
        case ADD_PROOF_LISTENER:
            if (state.proofListeners.indexOf(action.id) !== -1) return state;
            return { ...state, proofListeners: [...state.proofListeners, action.id] };
        case ADD_TRANSACTION_LISTENER:
            if (state.transactionListeners.indexOf(action.id) !== -1) return state;
            return { ...state, transactionListeners: [...state.transactionListeners, action.id] };
        case OPEN_WIZARD_IN_EDIT_MODE:
            return { ...state, wizardInEditMode: true };
        case INIT_STATE:
            return state;
        default:
            return state;
    }
};
