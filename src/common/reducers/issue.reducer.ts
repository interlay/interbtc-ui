import {
    CHANGE_ISSUE_STEP,
    CHANGE_VAULT_BTC_ADDRESS_ON_ISSUE,
    CHANGE_VAULT_DOT_ADDRESS_ON_ISSUE,
    RESET_ISSUE_WIZARD,
    CHANGE_AMOUNT_BTC,
    UPDATE_ISSUE_GRIEFING_COLLATERAL,
    CHANGE_BTC_TX_ID,
    CHANGE_ISSUE_ID,
    ADD_ISSUE_REQUEST,
    UPDATE_ISSUE_REQUEST,
    CHANGE_ADDRESS,
    IssueActions,
    OPEN_WIZARD_IN_EDIT_MODE,
    ADD_VAULT_ISSUES,
    INIT_STATE,
    CHANGE_SELECTED_ISSUE,
    UPDATE_ALL_ISSUE_REQUESTS,
} from "../types/actions.types";
import { IssueState } from "../types/issue.types";

const initialState = {
    address: "",
    step: "ENTER_BTC_AMOUNT",
    amountBTC: "",
    griefingCollateral: "0",
    vaultBtcAddress: "",
    vaultDotAddress: "",
    id: "",
    btcTxId: "",
    issueRequests: new Map(),
    wizardInEditMode: false,
    vaultIssues: [],
    selectedRequest: undefined,
};

export const issueReducer = (state: IssueState = initialState, action: IssueActions): IssueState => {
    switch (action.type) {
        case CHANGE_SELECTED_ISSUE:
            return { ...state, selectedRequest: action.request };
        case CHANGE_ADDRESS:
            return { ...state, address: action.address };
        case CHANGE_ISSUE_STEP:
            return { ...state, step: action.step };
        case CHANGE_AMOUNT_BTC:
            return { ...state, amountBTC: action.amount };
        case UPDATE_ISSUE_GRIEFING_COLLATERAL:
            return { ...state, griefingCollateral: action.griefingCollateral };
        case CHANGE_VAULT_BTC_ADDRESS_ON_ISSUE:
            return { ...state, vaultBtcAddress: action.vaultBtcAddress };
        case CHANGE_VAULT_DOT_ADDRESS_ON_ISSUE:
            return { ...state, vaultDotAddress: action.vaultDotAddress };
        case CHANGE_ISSUE_ID:
            return { ...state, id: action.id };
        case RESET_ISSUE_WIZARD:
            const newState = {
                ...initialState,
                address: state.address,
                issueRequests: state.issueRequests,
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
        case OPEN_WIZARD_IN_EDIT_MODE:
            return { ...state, wizardInEditMode: true };
        case INIT_STATE:
            return { ...state, step: "ENTER_BTC_AMOUNT", amountBTC: "", issueRequests: new Map() };
        case ADD_VAULT_ISSUES:
            return { ...state, vaultIssues: action.vaultIssues };
        case UPDATE_ALL_ISSUE_REQUESTS:
            const newRequests = new Map(state.issueRequests);
            newRequests.set(action.userDotAddress, action.issueRequests);
            return { ...state, issueRequests: newRequests };
        default:
            return state;
    }
};
