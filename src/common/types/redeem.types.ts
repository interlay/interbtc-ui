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

export type DashboardRequestInfo = Pick<
    RedeemRequest,
    | "id"
    // | "timestamp"
    | "amountPolkaBTC"
    | "creation"
    | "vaultDotAddress"
    | "btcAddress"
    | "completed"
    | "cancelled"
    | "isExpired"
    | "reimbursed"
>;

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
    // timestamp: string;
    user: string;
    btcAddress: string;
    polkaBTC: string;
    unlockedDOT: string;
    status: string;
    completed: boolean;
    cancelled: boolean;
}
