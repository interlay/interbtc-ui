import {
    CHANGE_REDEEM_STEP,
    CHANGE_VAULT_BTC_ADDRESS_ON_REDEEM,
    CHANGE_VAULT_DOT_ADDRESS_ON_REDEEM,
    RESET_REDEEM_WIZARD,
    CHANGE_AMOUNT_POLKA_BTC,
    CHANGE_BTC_ADDRESS,
    CHANGE_REDEEM_ID,
    CHANGE_ADDRESS,
    ADD_TRANSACTION_LISTENER_REDEEM,
    INIT_STATE,
    RedeemActions,
    ADD_REDEEM_REQUEST,
    UPDATE_REDEEM_REQUEST
} from "../types/actions.types";
import { RedeemState } from "../types/redeem.types";

const initialState = {
    address: "",
    step: "ENTER_POLKABTC",
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
        case INIT_STATE:
            return { ...state, transactionListeners: [] };
        default:
            return state;
    }
};
