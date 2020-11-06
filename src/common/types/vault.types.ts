export interface VaultReplaceRequest {
    id: string;
    timestamp: string;
    vault: string;
    btcAddress: string;
    polkaBTC: string;
    lockedDOT: string;
    status: string;
}

export interface VaultState {
    requests: VaultReplaceRequest[];
    isReplacmentPending: boolean;
    btcAddress: string;
    collateralization: number | undefined;
    collateral: string;
    lockedBTC: string;
}
