import { toast } from "react-toastify";
import { remove0x } from "./utils";
import { Dispatch } from "redux";
import { IssueRequest } from "../../common/types/issue.types";
import { IssueActions } from "../types/actions.types";
import { updateIssueRequestAction, AddTransactionListenerIssue } from "../actions/issue.actions";

export async function startTransactionWatcherIssue(
    request: IssueRequest,
    dispatch: Dispatch<IssueActions>
): Promise<void> {
    dispatch(AddTransactionListenerIssue(request.id));
    updateTransactionStatusIssue(request, dispatch).then(() => {
        setInterval(() => updateTransactionStatusIssue(request, dispatch), 10_000);
    });
}

export async function updateTransactionStatusIssue(
    request: IssueRequest,
    dispatch: Dispatch<IssueActions>
): Promise<void> {
    if (request && request.btcTxId) {
        try {
            const txStatus = await window.polkaBTC.btcCore.getTransactionStatus(remove0x(request.btcTxId));
            const updatedRequest = request;
            if (request.confirmations !== txStatus.confirmations) {
                updatedRequest.confirmations = txStatus.confirmations;
                dispatch(updateIssueRequestAction(updatedRequest));
            }
        } catch (error) {
            toast.error(error.toString());
        }
    }
}

export async function startTransactionWatcherRedeem(
    request: RedeemRequest,
    dispatch: Dispatch<IssueActions>
): Promise<void> {
    dispatch(AddTransactionListenerIssue(request.id));
    updateTransactionStatusIssue(request, dispatch).then(() => {
        setInterval(() => updateTransactionStatusIssue(request, dispatch), 10_000);
    });
}