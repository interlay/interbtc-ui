import { Prices } from "../types/util.types";
import { Dispatch } from "redux";
import { updateOfPricesAction } from "../actions/general.actions";
import { StoreState } from "../types/util.types";

export default function fetchPrices(dispatch: Dispatch, store: StoreState): void {
    const state = store.getState();
    const storePrices = state.general.prices;

    fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,polkadot&vs_currencies=usd")
        .then((response) => {
            return response.json() as Promise<Prices>;
        })
        .then((prices) => {
            // update the store only if the price is actually changed
            if (prices.bitcoin.usd !== storePrices.bitcoin.usd || prices.polkadot.usd !== storePrices.polkadot.usd) {
                dispatch(updateOfPricesAction(prices));
            }
        });
}
