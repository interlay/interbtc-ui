import {combineReducers} from "redux";
import { apiReducer as api } from "./api.reducer";
import { pricesReducer as prices } from "./prices.reducer";

export const rootReducer = combineReducers({
    api,
    prices
});