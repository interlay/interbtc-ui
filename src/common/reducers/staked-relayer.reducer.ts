import { StakedRelayerClient } from "@interlay/polkabtc";
import { ApiActions, ADD_STAKED_RELAYER_INSTANCE } from "../types/actions.types";

export const stakedRelayerReducer = (
    state: StakedRelayerClient | null = null,
    action: ApiActions
): StakedRelayerClient | null => {
    switch (action.type) {
        case ADD_STAKED_RELAYER_INSTANCE:
            return action.stakedRelayer;
        default:
            return state;
    }
};
