export interface RedeemRequest {
    id: string;
    amountPolkaBTC: string;
    creation: string;
    // recipient btc address
    btcAddress: string;
    btcTxId: string;
    confirmations: number;
    completed: boolean;
    isExpired: boolean;
}

export interface RedeemState {
    address: string;
    step: string;
    amountPolkaBTC: string;
    btcAddress: string;
    vaultDotAddress: string;
    vaultBtcAddress: string;
    id: string;
    redeemRequests: Map<string, RedeemRequest[]>;
    transactionListeners: string[];
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
