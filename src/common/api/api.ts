import { StoreState } from "../types/util.types";
import { updatePricesAction } from "../actions/prices.actions";

export const priceBaseURL = "https://min-api.cryptocompare.com/data/pricemulti";
export const priceParams = "?fsyms=DOT&tsyms=USD,JPY,EUR,BTC&";
export const priceApiKey = "api_key=0fe74ac7dd16554406f7ec8d305807596571e13bd6b3c8ac496ac436c17c26e2";

export const fetchPrices = async (dispatch: any) => {
    return fetch(priceBaseURL + priceParams + priceApiKey)
        .then(response => response.json())
        .then(result => {
            dispatch(updatePricesAction({dotBtc: Number(result.DOT.BTC), dotUsd: Number(result.DOT.USD)}));
        });
}