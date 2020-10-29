import { ADD_REPLACE_REQUESTS, ReplaceActions } from "../types/actions.types";
import { Replace } from "../types/replace.types";

const initialState = {
    requests: [],
};

export const replaceReducer = (state: Replace = initialState, action: ReplaceActions): Replace => {
    switch (action.type) {
        case ADD_REPLACE_REQUESTS:
            return { ...state, requests: action.requests };
        default:
            return state;
    }
};
