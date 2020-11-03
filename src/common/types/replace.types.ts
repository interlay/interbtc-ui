export interface VaultReplaceRequest {
    id: string;
    timestamp: string;
    vault: string;
    btcAddress: string;
    polkaBTC: string;
    lockedDOT: string;
    status: string;
}

export interface Replace {
    requests: VaultReplaceRequest[];
    isReplacmentPending: boolean;
}
