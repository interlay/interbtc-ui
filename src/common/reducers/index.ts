import { combineReducers } from "redux";
import { generalReducer as general } from "./general.reducer";
import { pricesReducer as prices } from "./prices.reducer";
import { redeemReducer as redeem } from "./redeem.reducer";
import { issueReducer as issue } from "./issue.reducer";
import { replaceReducer as replace } from "./replace.reducer";

export const rootReducer = combineReducers({
    general,
    prices,
    redeem,
    issue,
    replace
});
