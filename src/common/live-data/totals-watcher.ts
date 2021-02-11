import { Dispatch } from "redux";
import { updateTotalsAction } from "../actions/general.actions";
import { StoreState } from "../types/util.types";
import { planckToDOT, satToBTC } from "@interlay/polkabtc";
import Big from "big.js";

export default async function fetchTotals(dispatch: Dispatch, store: StoreState): Promise<void> {
    const state = store.getState();
    const { totalLockedDOT, totalPolkaBTC, polkaBtcLoaded } = state.general;
    if (!polkaBtcLoaded) return;

    try {
        const totalPolkaSAT = await window.polkaBTC.treasury.totalPolkaBTC();
        const totalLockedPLANCK = await window.polkaBTC.collateral.totalLockedDOT();
        const latestTotalPolkaBTC = new Big(satToBTC(totalPolkaSAT.toString())).round(3).toString();
        const latestTotalLockedDOT = new Big(planckToDOT(totalLockedPLANCK.toString())).round(3).toString();

        // update store only if there is a difference between the latest totals and current totals
        if (totalPolkaBTC !== latestTotalPolkaBTC || totalLockedDOT !== latestTotalLockedDOT) {
            dispatch(updateTotalsAction(latestTotalLockedDOT, latestTotalPolkaBTC));
        }
    } catch (error) {
        console.log(error);
    }
}
