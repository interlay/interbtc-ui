import { Dispatch } from "redux";
import { updateBalanceDOTAction, updateBalancePolkaBTCAction } from "../actions/general.actions";
import { StoreState } from "../types/util.types";
import { planckToDOT, satToBTC } from "@interlay/polkabtc";

export default async function fetchBalances(dispatch: Dispatch, store: StoreState): Promise<void> {
    const state = store.getState();
    const { balanceDOT, balancePolkaBTC, polkaBtcLoaded, address } = state.general;
    if (!polkaBtcLoaded) return;

    try {
        const accountId = window.polkaBTC.api.createType("AccountId", address);
        const balancePolkaSAT = await window.polkaBTC.treasury.balancePolkaBTC(accountId);
        const balancePLANCK = await window.polkaBTC.collateral.balanceDOT(accountId);
        const latestBalancePolkaBTC = satToBTC(balancePolkaSAT.toString());
        const latestBalanceDOT = planckToDOT(balancePLANCK.toString());

        // update store only if there is a difference between balances
        if (latestBalanceDOT !== balanceDOT) {
            dispatch(updateBalanceDOTAction(balanceDOT));
        }

        if (latestBalancePolkaBTC !== balancePolkaBTC) {
            dispatch(updateBalancePolkaBTCAction(balancePolkaBTC));
        }
    } catch (error) {
        console.log(error);
    }
}
