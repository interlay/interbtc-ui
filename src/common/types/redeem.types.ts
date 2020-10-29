export interface RedeemRequest {
    id: string;
    amountPolkaBTC: string;
    creation: Date;
    vaultBTCAddress: string;
    btcTxId: string;
    confirmations: number;
    completed: boolean;
}

export interface Redeem {
    address: string;
    step: string;
    amountPolkaBTC: string;
    btcAddress: string;
    vaultDotAddress: string;
    vaultBtcAddress: string;
    id: string;
    redeemRequests: Map<string, RedeemRequest[]>;
    vaultRedeems: VaultRedeem[];
}

export interface VaultRedeem {
    id: string;
    timestamp: string;
    user: string;
    btcAddress: string;
    polkaBTC: string;
    unlockedDOT: string;
    status: string;
}
