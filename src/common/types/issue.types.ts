export interface IssueRequest {
    id: string;
    amountBTC: string;
    creation: Date;
    vaultBTCAddress: string;
    btcTxId: string;
    confirmations: number;
    completed: boolean;
    merkleProof: string;
    transactionBlockHeight: number;
    rawTransaction: Uint8Array;
}

export interface Issue {
    step: string;
    amountBTC: string;
    feeBTC: string;
    vaultDotAddress: string;
    vaultBtcAddress: string;
    id: string;
    btcTxId: string;
    issueRequests: IssueRequest[];
    transactionListeners: string[];
    proofListeners: string[];
}
