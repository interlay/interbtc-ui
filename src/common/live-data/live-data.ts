import { Dispatch } from "redux";
import fetchPrices from "./price-data";
import fetchBtcRelayAndBitcoinHeight from "./block-height-data";
import { StoreState } from "../types/util.types";

export default function startFetchingLiveData(dispatch: Dispatch, store: StoreState): void {
    if (window.isFetchingActive) return;
    window.isFetchingActive = true;

    // FETCH LIVE DATA PRICES
    fetchPrices(dispatch, store);
    window.setInterval(() => fetchPrices(dispatch, store), 5000);

    // FETCH BTC-RELAY HEIGHT AND BITCOIN HEIGHT
    fetchBtcRelayAndBitcoinHeight(dispatch, store);
    window.setInterval(() => fetchBtcRelayAndBitcoinHeight(dispatch, store), 10000);
}
