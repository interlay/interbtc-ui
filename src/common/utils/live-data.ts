import { Prices } from "../types/util.types";
import { Dispatch } from "redux";
import { updateOfPricesAction } from "../actions/general.actions";

// price fetcher
function fetchPrices(dispatch: Dispatch) {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,polkadot&vs_currencies=usd")
        .then((response) => {
            return response.json() as Promise<Prices>;
        })
        .then((prices) => {
            if (prices.bitcoin.usd) dispatch(updateOfPricesAction(prices));
        });
}

export default function startFetchingLiveData(dispatch: Dispatch): void {
    if (window.isFetchingActive) return;
    window.isFetchingActive = true;

    fetchPrices(dispatch);
    window.setInterval(() => fetchPrices(dispatch), 5000);
}
