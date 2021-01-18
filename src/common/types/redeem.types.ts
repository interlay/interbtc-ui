export interface RedeemRequest {
    id: string;
    amountPolkaBTC: string;
    creation: string;
    fee: string;
    btcAddress: string;
    vaultDotAddress?: string;
    transactionBlockHeight?: number;
    btcTxId: string;
    confirmations: number;
    completed: boolean;
    isExpired: boolean;
    cancelled: boolean;
    reimbursed: boolean;
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
    fee: string;
}

export interface VaultRedeem {
    id: string;
    timestamp: string;
    user: string;
    btcAddress: string;
    polkaBTC: string;
    unlockedDOT: string;
    status: string;
    completed: boolean;
    cancelled: boolean;
}
