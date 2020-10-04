export type IssueRequest = {
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
};

export interface Issue {
    step: string;
    amountBTC: number;
    feeBTC: number;
    vaultDotAddress: string;
    vaultBtcAddress: string;
    id: string;
    btcTxId: string;
}
