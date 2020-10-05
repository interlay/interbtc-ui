import { PolkaBTCAPI } from "@interlay/polkabtc";
import { toast } from "react-toastify";
import { remove0x } from "./utils";
import { Dispatch } from "redux";
import { IssueRequest } from "../../common/types/issue.types";
import { IssueActions } from "../types/actions.types";
import { updateIssueRequestAction, addTransactionListener, addProofListener } from "../actions/issue.actions";

export async function startTransactionWatcherIssue(
    request: IssueRequest,
    polkaBTC: PolkaBTCAPI,
    dispatch: Dispatch<IssueActions>
) {
    dispatch(addTransactionListener(request.id));
    updateTransactionStatusIssue(request, polkaBTC, dispatch).then(() => {
        setInterval(() => updateTransactionStatusIssue(request, polkaBTC, dispatch), 10_000);
    });
}

export async function startTransactionProofWatcherIssue(
    request: IssueRequest,
    polkaBTC: PolkaBTCAPI,
    dispatch: Dispatch<IssueActions>
) {
    dispatch(addProofListener(request.id));
    updateTransactionProofData(request, polkaBTC, dispatch).then(() => {
        setInterval(() => updateTransactionProofData(request, polkaBTC, dispatch), 10_000);
    });
}

export async function updateTransactionStatusIssue(
    request: IssueRequest,
    polkaBTC: PolkaBTCAPI,
    dispatch: Dispatch<IssueActions>
) {
    if (request && request.btcTxId) {
        try {
            const txStatus = await polkaBTC.btcCore.getTransactionStatus(remove0x(request.btcTxId));
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

export async function updateTransactionProofData(
    request: IssueRequest,
    polkaBTC: PolkaBTCAPI,
    dispatch: Dispatch<IssueActions>
) {
    if (request && request.confirmations > 6 && !request.completed && request.btcTxId) {
        try {
            const txId = remove0x(request.btcTxId);
            const transactionBlockHeight = await polkaBTC.btcCore.getTransactionBlockHeight(txId);
            const merkleProof = await polkaBTC.btcCore.getMerkleProof(txId);
            const rawTx = await polkaBTC.btcCore.getRawTransaction(txId);

            const updatedRequest = request;
            const newHeight = transactionBlockHeight ? transactionBlockHeight : 0;
            if (
                updatedRequest.transactionBlockHeight !== newHeight ||
                updatedRequest.merkleProof !== merkleProof ||
                updatedRequest.rawTransaction.byteLength !== rawTx.byteLength
            ) {
                updatedRequest.transactionBlockHeight = newHeight;
                updatedRequest.merkleProof = merkleProof;
                updatedRequest.rawTransaction = rawTx;
                dispatch(updateIssueRequestAction(updatedRequest));
            }
        } catch (error) {
            toast.error(error.toString());
        }
    }
}
