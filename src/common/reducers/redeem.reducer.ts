import {
    CHANGE_REDEEM_STEP,
    CHANGE_VAULT_BTC_ADDRESS_ON_REDEEM,
    CHANGE_VAULT_DOT_ADDRESS_ON_REDEEM,
    RESET_REDEEM_WIZARD,
    CHANGE_AMOUNT_POLKA_BTC,
    CHANGE_BTC_ADDRESS,
    CHANGE_REDEEM_ID,
    CHANGE_ADDRESS,
    RETRY_REDEEM_REQUEST,
    REIMBURSE_REDEEM_REQUEST,
    ADD_TRANSACTION_LISTENER_REDEEM,
    INIT_STATE,
    REDEEM_EXPIRED,
    RedeemActions,
    ADD_REDEEM_REQUEST,
    UPDATE_REDEEM_REQUEST,
    UPDATE_ALL_REDEEM_REQUESTS,
    ADD_VAULT_REDEEMS,
    UPDATE_REDEEM_FEE,
} from "../types/actions.types";
import { RedeemState } from "../types/redeem.types";

const initialState = {
    address: "",
    fee: "0",
    step: "AMOUNT_AND_ADDRESS",
    amountPolkaBTC: "",
    btcAddress: "",
    vaultBtcAddress: "",
    vaultDotAddress: "",
    id: "",
    redeemRequests: new Map(),
    transactionListeners: [],
    vaultRedeems: [],
};

export const redeemReducer = (state: RedeemState = initialState, action: RedeemActions): RedeemState => {
    switch (action.type) {
        case CHANGE_ADDRESS:
            return { ...state, address: action.address };
        case CHANGE_REDEEM_STEP:
            return { ...state, step: action.step };
        case CHANGE_AMOUNT_POLKA_BTC:
            return { ...state, amountPolkaBTC: action.amount };
        case CHANGE_BTC_ADDRESS:
            return { ...state, btcAddress: action.btcAddress };
        case CHANGE_VAULT_BTC_ADDRESS_ON_REDEEM:
            return { ...state, vaultBtcAddress: action.vaultBtcAddress };
        case CHANGE_VAULT_DOT_ADDRESS_ON_REDEEM:
            return { ...state, vaultDotAddress: action.vaultDotAddress };
        case CHANGE_REDEEM_ID:
            return { ...state, id: action.id };
        case UPDATE_REDEEM_FEE:
            return { ...state, fee: action.fee };
        case RESET_REDEEM_WIZARD:
            return { ...initialState, address: state.address, redeemRequests: state.redeemRequests };
        case ADD_REDEEM_REQUEST:
            const newMap = new Map(state.redeemRequests);
            const requests = state.redeemRequests.get(state.address);
            if (requests) {
                newMap.set(state.address, [...requests, action.request]);
            } else {
                newMap.set(state.address, [action.request]);
            }
            return { ...state, redeemRequests: newMap };
        case ADD_TRANSACTION_LISTENER_REDEEM:
            if (state.transactionListeners.indexOf(action.id) !== -1) return state;
            return { ...state, transactionListeners: [...state.transactionListeners, action.id] };
        case UPDATE_REDEEM_REQUEST:
            const map = new Map(state.redeemRequests);
            const reqs = state.redeemRequests.get(state.address);
            if (!reqs) return state;
            const updateRequests = reqs.map((request) => {
                if (action.request.id !== request.id) return request;
                else return action.request;
            });
            map.set(state.address, updateRequests);
            return { ...state, redeemRequests: map };
        case REDEEM_EXPIRED:
            const redeemReqMap = new Map(state.redeemRequests);
            const currentRequests = state.redeemRequests.get(state.address);
            if (!currentRequests) return state;
            let updateStore = false;
            const requestsToUpdate = currentRequests.map((request) => {
                if (action.request.id !== request.id) return request;
                if (action.request.isExpired !== request.isExpired) {
                    updateStore = true;
                }
                return action.request;
            });
            if (!updateStore) return state;
            redeemReqMap.set(state.address, requestsToUpdate);
            return { ...state, redeemRequests: redeemReqMap };
        case RETRY_REDEEM_REQUEST:
            const requestsMap = new Map(state.redeemRequests);
            const allRequests = state.redeemRequests.get(state.address);
            if (!allRequests) return state;
            const updatedRequests = allRequests.map((request) => {
                if (request.id === action.id) {
                    return { ...request, cancelled: true, reimbursed: false };
                }
                return request;
            });
            requestsMap.set(state.address, updatedRequests);
            return { ...state, redeemRequests: requestsMap };
        case REIMBURSE_REDEEM_REQUEST:
            const newRequestsMap = new Map(state.redeemRequests);
            const allCurrentRequests = state.redeemRequests.get(state.address);
            if (!allCurrentRequests) return state;
            const allUpdatedRequests = allCurrentRequests.map((request) => {
                if (request.id === action.id) {
                    return { ...request, cancelled: true, reimbursed: true };
                }
                return request;
            });
            newRequestsMap.set(state.address, allUpdatedRequests);
            return { ...state, redeemRequests: newRequestsMap };
        case INIT_STATE:
            return { ...state, fee: "0", transactionListeners: [], step: "AMOUNT_AND_ADDRESS" };
        case ADD_VAULT_REDEEMS:
            return { ...state, vaultRedeems: action.vaultRedeems };
        case UPDATE_ALL_REDEEM_REQUESTS:
            const newRequests = new Map(state.redeemRequests);
            const mappedRequests = action.redeemRequests.map((newRequest) => {
                let foundRequest = undefined;
                const requestsArray = state.redeemRequests.get(state.address);
                if (requestsArray)
                    foundRequest = requestsArray.filter((oldRequest) => oldRequest.id === newRequest.id)[0];
                return { ...newRequest, isExpired: foundRequest ? foundRequest.isExpired : false };
            });
            newRequests.set(state.address, mappedRequests);
            return { ...state, redeemRequests: newRequests };
        default:
            return state;
    }
};
