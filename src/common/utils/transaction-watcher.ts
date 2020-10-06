import { PolkaBTCAPI } from "@interlay/polkabtc";
import { toast } from "react-toastify";
import { remove0x } from "./utils";
import { Dispatch } from "redux";
import { IssueRequest } from "../../common/types/issue.types";
import { IssueActions } from "../types/actions.types";
import { updateIssueRequestAction, addTransactionListener } from "../actions/issue.actions";
import Storage from "../controllers/storage";

export async function startTransactionWatcherIssue(
    request: IssueRequest,
    polkaBTC: PolkaBTCAPI,
    dispatch: Dispatch<IssueActions>,
    storage: Storage
): Promise<void> {
    dispatch(addTransactionListener(request.id));
    updateTransactionStatusIssue(request, polkaBTC, dispatch, storage).then(() => {
        setInterval(() => updateTransactionStatusIssue(request, polkaBTC, dispatch, storage), 10_000);
    });
}

export async function updateTransactionStatusIssue(
    request: IssueRequest,
    polkaBTC: PolkaBTCAPI,
    dispatch: Dispatch<IssueActions>,
    storage: Storage
): Promise<void> {
    if (request && request.btcTxId) {
        try {
            const txStatus = await polkaBTC.btcCore.getTransactionStatus(remove0x(request.btcTxId));
            const updatedRequest = request;
            if (request.confirmations !== txStatus.confirmations) {
                updatedRequest.confirmations = txStatus.confirmations;
                dispatch(updateIssueRequestAction(updatedRequest));
                storage.modifyIssueRequest(updatedRequest);
            }
        } catch (error) {
            toast.error(error.toString());
        }
    }
}
