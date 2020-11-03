import {
    ADD_REPLACE_REQUESTS,
    ADD_REPLACE_REQUEST,
    REQUEST_REPLACMENT_PENDING,
    ReplaceActions,
} from "../types/actions.types";
import { Replace } from "../types/replace.types";

const initialState = {
    requests: [],
    isReplacmentPending: false,
};

export const replaceReducer = (state: Replace = initialState, action: ReplaceActions): Replace => {
    switch (action.type) {
        case ADD_REPLACE_REQUESTS:
            return { ...state, requests: action.requests };
        case ADD_REPLACE_REQUEST:
            return { ...state, requests: [...state.requests, action.request] };
        case REQUEST_REPLACMENT_PENDING:
            return { ...state, isReplacmentPending: action.isReplacmentPending };
        default:
            return state;
    }
};
