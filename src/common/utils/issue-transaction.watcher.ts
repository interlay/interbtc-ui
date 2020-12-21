import { stripHexPrefix } from "@interlay/polkabtc";
import { Dispatch } from "redux";
import { IssueRequest } from "../types/issue.types";
import { IssueActions } from "../types/actions.types";
import { updateIssueRequestAction, addTransactionListenerIssue } from "../actions/issue.actions";
import { updateBalances } from "./utils";


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
    
    if (!allRequests) return;

    let storeRequest = allRequests.filter((r) => request.id === r.id)[0];
    if (storeRequest && !storeRequest.completed && window.polkaBTC) {
        const fetchedRequest = await window.polkaBTC.issue.getRequestById(storeRequest.id);
        if (fetchedRequest.completed.valueOf()) {
            dispatch(updateIssueRequestAction({
                    ...storeRequest,
                    completed: true
                }));
            updateBalances(dispatch,address,balanceDOT,balancePolkaBTC);
        };
        
    }
    if (storeRequest && storeRequest.btcTxId && window.polkaBTC) {
        try {
            const updatedRequest = storeRequest;
            updatedRequest.btcTxId = await window.polkaBTC.btcCore.getTxIdByOpReturn(
                storeRequest.id,
                storeRequest.vaultBTCAddress,
                storeRequest.amountBTC
            );
            const txStatus = await window.polkaBTC.btcCore.getTransactionStatus(stripHexPrefix(storeRequest.btcTxId));
            if (storeRequest.confirmations !== txStatus.confirmations) {
                updatedRequest.confirmations = txStatus.confirmations;
                dispatch(updateIssueRequestAction(updatedRequest));
            }
        } catch (error) {
            console.log(error.toString());
        }
    }
}


