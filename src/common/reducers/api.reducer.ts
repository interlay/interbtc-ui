import { PolkaBTCAPI } from "@interlay/polkabtc";
import { ADD_INSTANCE, ApiActions } from "../types/actions.types";

export const apiReducer = (state: PolkaBTCAPI | null = null, action: ApiActions): PolkaBTCAPI | null => {
    switch (action.type) {
        case ADD_INSTANCE:
            return action.polkaBtc;
        default:
            return state;
    }
};
