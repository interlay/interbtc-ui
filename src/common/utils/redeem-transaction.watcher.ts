import { stripHexPrefix } from "@interlay/polkabtc";
import { Dispatch } from "redux";
import { RedeemRequest } from "../types/redeem.types";
import { RedeemActions } from "../types/actions.types";
import { updateRedeemRequestAction, addTransactionListenerRedeem } from "../actions/redeem.actions";
import { updateBalances } from "./utils";

export async function startTransactionWatcherRedeem(
    request: RedeemRequest,
    dispatch: Dispatch<RedeemActions>
): Promise<void> {
    dispatch(addTransactionListenerRedeem(request.id));
    updateTransactionStatusRedeem(request, dispatch).then(() => {
        setInterval(() => updateTransactionStatusRedeem(request, dispatch), 10_000);
    });
}

export async function updateTransactionStatusRedeem(
    request: RedeemRequest,
    dispatch: Dispatch<RedeemActions>
): Promise<void> {
    const { address, balanceDOT, balancePolkaBTC } = window.store.getState().general;
    const allRequests = window.store.getState().redeem.redeemRequests.get(address);

    if (!allRequests) return;

    const storeRequest = allRequests.filter((r) => request.id === r.id)[0];
    if (storeRequest && !storeRequest.completed && window.polkaBTC) {
        const fetchedRequest = await window.polkaBTC.redeem.getRequestById(storeRequest.id);
        if (fetchedRequest.completed.valueOf()) {
            dispatch(
                updateRedeemRequestAction({
                    ...storeRequest,
                    completed: true,
                })
            );
            updateBalances(dispatch, address, balanceDOT, balancePolkaBTC);
        }
    }
    if (storeRequest && storeRequest.btcTxId && window.polkaBTC) {
        try {
            const updatedRequest = storeRequest;
            updatedRequest.btcTxId = await window.polkaBTC.btcCore.getTxIdByOpReturn(
                storeRequest.id,
                storeRequest.btcAddress,
                storeRequest.amountPolkaBTC
            );
            const txStatus = await window.polkaBTC.btcCore.getTransactionStatus(stripHexPrefix(updatedRequest.btcTxId));
            if (storeRequest.confirmations !== txStatus.confirmations) {
                updatedRequest.confirmations = txStatus.confirmations;
                dispatch(updateRedeemRequestAction(updatedRequest));
            }
        } catch (error) {
            console.log(error.toString());
        }
    }
}
