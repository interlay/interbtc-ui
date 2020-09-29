import {  Prices } from "../types/util.types";
import { UpdatePrices, UPDATE_PRICES } from "../types/actions.types";

export const updatePricesAction = (prices: Prices): UpdatePrices => ({
    type: UPDATE_PRICES,
    prices
});