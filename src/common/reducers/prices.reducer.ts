import { UPDATE_PRICES, PricesActions } from "../types/actions.types"; 
import { Prices } from "../types/util.types";

const initialState = {
    dotBtc: 0,
    dotUsd: 0
};

export const pricesReducer = (state: Prices = initialState, action: PricesActions) : Prices => {
    switch(action.type) {
    case UPDATE_PRICES: 
        return action.prices;
    default: return state;
    }
};