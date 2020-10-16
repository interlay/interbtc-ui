import { IS_POLKA_BTC_LOADED, IS_STAKED_RELAYER_LOADED, GeneralActions, CHANGE_ADDRESS, INIT_STATE } from "../types/actions.types";
import { GeneralType } from "../types/util.types";

const initialState = {
    polkaBtcLoaded: false,
    relayerLoaded: false,
    address: ""
}

export const generalReducer = (state: GeneralType = initialState, action: GeneralActions): GeneralType => {
    switch (action.type) {
        case IS_POLKA_BTC_LOADED:
            return {...state, polkaBtcLoaded: action.isLoaded};
        case IS_STAKED_RELAYER_LOADED:
            return {...state, relayerLoaded: action.isLoaded};
        case CHANGE_ADDRESS:
            return {...state, address: action.address};
        case INIT_STATE:
            return {...state, polkaBtcLoaded: false, relayerLoaded: false};
        default:
            return state;
    }
};
