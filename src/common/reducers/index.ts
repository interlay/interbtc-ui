import {combineReducers} from "redux";
import { apiReducer as api } from "./api.reducer";

export const rootReducer = combineReducers({
    api
});