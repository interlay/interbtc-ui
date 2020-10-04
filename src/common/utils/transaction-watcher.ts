import { PolkaBTCAPI } from "@interlay/polkabtc";
import { toast } from "react-toastify";
import Storage from "../controllers/storage";
import { remove0x } from "./utils";

export async function startTransactionWatcherIssue(id: string, polkaBTC: PolkaBTCAPI, storage: Storage) {
    updateTransactionStatusIssue(id, polkaBTC, storage).then(() => {
        setInterval(() => updateTransactionStatusIssue(id, polkaBTC, storage), 10_000);
    });
}

export async function startTransactionProofWatcherIssue(id: string, polkaBTC: PolkaBTCAPI, storage: Storage) {
    updateTransactionProofData(id, polkaBTC, storage).then(() => {
        setInterval(() => updateTransactionProofData(id, polkaBTC, storage), 10_000);
    });
}

export async function updateTransactionStatusIssue(id: string, polkaBTC: PolkaBTCAPI, storage: Storage) {
    const request = storage.getIssueRequest(id);

    if (request && request.btcTxId) {
        try {
            const txStatus = await polkaBTC.btcCore.getTransactionStatus(remove0x(request.btcTxId));
            const updatedRequest = request;
            updatedRequest.confirmations = txStatus.confirmations;

            storage.modifyIssueRequest(updatedRequest);
        } catch (error) {
            toast.error(error.toString());
        }
    }
}

export async function updateTransactionProofData(id: string, polkaBTC: PolkaBTCAPI, storage: Storage) {
    const request = storage.getIssueRequest(id);

    if (request && request.confirmations > 6 && !request.completed && request.btcTxId) {
        try {
            const txId = remove0x(request.btcTxId);
            const transactionBlockHeight = await polkaBTC.btcCore.getTransactionBlockHeight(txId);
            const merkleProof = await polkaBTC.btcCore.getMerkleProof(txId);
            const rawTx = await polkaBTC.btcCore.getRawTransaction(txId);

            const updatedRequest = request;

            updatedRequest.transactionBlockHeight = transactionBlockHeight ? transactionBlockHeight : 0;
            updatedRequest.merkleProof = merkleProof;
            updatedRequest.rawTransaction = rawTx;

            storage.modifyIssueRequest(updatedRequest);
        } catch (error) {
            toast.error(error.toString());
        }
    }
}
