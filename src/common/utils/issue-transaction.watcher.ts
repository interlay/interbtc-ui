import { stripHexPrefix } from "@interlay/polkabtc";
import { Dispatch } from "redux";
import { IssueRequest } from "../types/issue.types";
import { IssueActions } from "../types/actions.types";
import { updateIssueRequestAction, addTransactionListenerIssue } from "../actions/issue.actions";
import { updateBalances, parachainToUIIssueRequest } from "./utils";

export async function startTransactionWatcherIssue(
    request: IssueRequest,
    dispatch: Dispatch<IssueActions>
): Promise<void> {
    dispatch(addTransactionListenerIssue(request.id));
    updateTransactionStatusIssue(request, dispatch).then(() => {
        setInterval(() => updateTransactionStatusIssue(request, dispatch), 10_000);
    });
}

export async function updateTransactionStatusIssue(
    request: IssueRequest,
    dispatch: Dispatch<IssueActions>
): Promise<void> {
    const { address, balanceDOT, balancePolkaBTC } = window.store.getState().general;
    const allRequests = window.store.getState().issue.issueRequests.get(address);
    let shouldRequestBeUpdate = false;

    if (!allRequests) return;

    let requestToUpdate = allRequests.filter((r) => request.id === r.id)[0];
    try {
        if (requestToUpdate && !requestToUpdate.completed && !requestToUpdate.cancelled && window.polkaBTC) {
            const parachainRequest = await window.polkaBTC.issue.getRequestById("0x" + requestToUpdate.id);
            const requestId = window.polkaBTC.api.createType("H256", requestToUpdate.id);
            const fetchedRequest = parachainToUIIssueRequest(requestId, parachainRequest);

            if (!requestToUpdate.btcTxId) {
                const btcTxId = await window.polkaBTC.btcCore.getTxIdByOpReturn(
                    request.id,
                    request.vaultBTCAddress,
                    request.amountBTC
                );
                requestToUpdate.btcTxId = btcTxId;
                shouldRequestBeUpdate = true;
            }

            if (fetchedRequest.completed || fetchedRequest.cancelled) {
                requestToUpdate = {
                    ...requestToUpdate,
                    completed: fetchedRequest.completed,
                    cancelled: fetchedRequest.cancelled,
                };
                updateBalances(dispatch, address, balanceDOT, balancePolkaBTC);
                shouldRequestBeUpdate = true;
            }
        }
        if (requestToUpdate && requestToUpdate.btcTxId && window.polkaBTC) {
            const txStatus = await window.polkaBTC.btcCore.getTransactionStatus(
                stripHexPrefix(requestToUpdate.btcTxId)
            );
            if (requestToUpdate.confirmations !== txStatus.confirmations) {
                requestToUpdate.confirmations = txStatus.confirmations;
                shouldRequestBeUpdate = true;
            }
            if (shouldRequestBeUpdate) {
                dispatch(updateIssueRequestAction(requestToUpdate));
            }
        }
    } catch (error) {
        console.log(error.toString());
    }
}
