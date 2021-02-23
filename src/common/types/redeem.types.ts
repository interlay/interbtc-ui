export interface RedeemRequest {
    id: string;
    amountPolkaBTC: string;
    // timestamp: string;
    creation: string;
    fee: string;
    btcAddress: string;
    vaultDotAddress?: string;
    btcTxId: string;
    totalAmount: string;
    confirmations: number;
    completed: boolean;
    isExpired: boolean;
    cancelled: boolean;
    reimbursed: boolean;
}

export type DashboardRequestInfo = {
    id: string;
    timestamp: string;
    amountPolkaBTC: string;
    creation: string;
    vaultDotAddress: string;
    btcAddress: string;
    completed: boolean;
    cancelled: boolean;
    isExpired: boolean;
    reimbursed: boolean;
};

export interface RedeemState {
    address: string;
    step: string;
    amountPolkaBTC: string;
    btcAddress: string;
    vaultDotAddress: string;
    vaultBtcAddress: string;
    id: string;
    redeemRequests: Map<string, RedeemRequest[]>;
    vaultRedeems: VaultRedeem[];
    fee: string;
    premiumRedeem: boolean;
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
