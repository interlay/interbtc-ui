export type Vault = {
    vaultId: string;
    btcAddress: string;
    lockedDOT: string;
    lockedBTC: string;
    pendingBTC: string;
    status: string;
    unsettledCollateralization: string | undefined;
    settledCollateralization: string | undefined;
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
    collateralization: string | undefined;
    collateral: string;
    lockedBTC: string;
    sla: string;
    apy: string;
}
