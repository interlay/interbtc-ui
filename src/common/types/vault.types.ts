export type Vault = {
    vaultId: string;
    btcAddress: string;
    lockedDOT: string;
    lockedBTC: string;
    pendingBTC: string;
    status: string;
    unsettledCollateralization: number | undefined;
    settledCollateralization: number | undefined;
};

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
    sla: string;
    premiumVault: Vault | undefined;
}
