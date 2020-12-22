import { stripHexPrefix } from "@interlay/polkabtc";
import { Dispatch } from "redux";
import { RedeemRequest } from "../types/redeem.types";
import { RedeemActions } from "../types/actions.types";
import { updateRedeemRequestAction, addTransactionListenerRedeem } from "../actions/redeem.actions";
import { updateBalances, parachainToUIRedeemRequest } from "./utils";

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
    let shouldRequestBeUpdate = false;

    if (!allRequests) return;

    let requestForUpdate = allRequests.filter((r) => request.id === r.id)[0];
    try {
        if (requestForUpdate && !requestForUpdate.completed && !requestForUpdate.cancelled && window.polkaBTC) {
            const parachainRequest = await window.polkaBTC.redeem.getRequestById("0x" + requestForUpdate.id);
            const requestId = window.polkaBTC.api.createType("H256", requestForUpdate.id);
            const fetchedRequest = parachainToUIRedeemRequest(requestId, parachainRequest);

            if (!requestForUpdate.btcTxId && fetchedRequest.completed) {
                const btcTxId = await window.polkaBTC.btcCore.getTxIdByOpReturn(
                    request.id,
                    request.btcAddress,
                    request.amountPolkaBTC
                );
                requestForUpdate.btcTxId = btcTxId;
                shouldRequestBeUpdate = true;
            }

            if (fetchedRequest.completed || fetchedRequest.cancelled) {
                requestForUpdate = {
                    ...requestForUpdate,
                    completed: fetchedRequest.completed,
                    cancelled: fetchedRequest.cancelled,
                };
                updateBalances(dispatch, address, balanceDOT, balancePolkaBTC);
                shouldRequestBeUpdate = true;
            }
        }
        if (requestForUpdate && requestForUpdate.btcTxId && window.polkaBTC) {
            const txStatus = await window.polkaBTC.btcCore.getTransactionStatus(
                stripHexPrefix(requestForUpdate.btcTxId)
            );
            if (requestForUpdate.confirmations !== txStatus.confirmations) {
                requestForUpdate.confirmations = txStatus.confirmations;
                shouldRequestBeUpdate = true;
            }
            if (shouldRequestBeUpdate) {
                dispatch(updateRedeemRequestAction(requestForUpdate));
            }
        }
    } catch (error) {
        console.log(error.toString());
    }
}
