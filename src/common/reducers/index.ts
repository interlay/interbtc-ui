import { combineReducers } from "redux";
import { apiReducer as api } from "./api.reducer";
import { pricesReducer as prices } from "./prices.reducer";
import { stakedRelayerReducer as relayer } from "./staked-relayer.reducer";

export const rootReducer = combineReducers({
    api,
    prices,
    relayer,
});
