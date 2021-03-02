export interface RedeemRequest {
    id: string;
    amountPolkaBTC: string;
    timestamp: string;
    creation: string;
    fee: string;
    btcAddress: string;
    vaultDotAddress?: string;
    btcTxId: string;
    totalAmount: string;
    confirmations: number;
    status: RedeemRequestStatus;
}

export enum RedeemRequestStatus {
    Completed,
    Expired,
    Reimbursed,
    Retried,
    PendingWithBtcTxNotFound,
    PendingWithBtcTxNotIncluded,
    PendingWithTooFewConfirmations,
    PendingWithEnoughConfirmations,
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

// TODO: remove and replace with polkabtc-stats
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

export interface RedeemState {
    // TODO: use current account from general state
    address: string;
    // current step in the wizard
    step: string;
    // id of the current request
    id: string;
    // true if premium redeem is selected
    premiumRedeem: boolean;
    // mapping of all redeem requests
    redeemRequests: Map<string, RedeemRequest[]>;
    // TODO: remove
    vaultRedeems: VaultRedeem[];
}
