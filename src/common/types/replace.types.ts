export interface ReplaceRequest {
    id: string;
    timestamp: string;
    vault: string;
    btcAddress: string;
    polkaBTC: string;
    lockedDOT: string;
    status: string;
}

export interface Replace {
    requests: ReplaceRequest[];
}
