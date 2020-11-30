export interface VaultReplaceRequest {
    id: string;
    timestamp: string;
    newVault: string;
    oldVault: string;
    btcAddress: string;
    polkaBTC: string;
    lockedDOT: string;
    status: string;
}

export interface VaultState {
    requests: VaultReplaceRequest[];
    btcAddress: string;
    collateralization: number | undefined;
    collateral: string;
    lockedBTC: string;
}
