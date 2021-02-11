export interface IssueRequest {
    id: string;
    amountBTC: string;
    timestamp?: string;
    totalAmount: string;
    creation: string;
    vaultBTCAddress: string;
    vaultDOTAddress: string;
    btcTxId: string;
    confirmations: number;
    completed: boolean;
    cancelled: boolean;
    merkleProof?: string;
    transactionBlockHeight?: number;
    rawTransaction?: Uint8Array;
    fee: string;
    griefingCollateral: string;
}

export type DashboardIssueInfo = {
    id: string;
    timestamp: string;
    amountBTC: string;
    creation: string;
    vaultBTCAddress: string;
    vaultDOTAddress: string;
    btcTxId: string;
    completed: boolean;
    cancelled: boolean;
};

export interface IssueMap {
    [key: string]: IssueRequest[];
}

export interface VaultIssue {
    id: string;
    user: string;
    timestamp: string;
    btcAddress: string;
    polkaBTC: string;
    lockedDOT: string;
    status: string;
    completed: boolean;
    cancelled: boolean;
}

export interface IssueState {
    selectedRequest?: IssueRequest;
    address: string;
    step: string;
    amountBTC: string;
    fee: string;
    griefingCollateral: string;
    vaultDotAddress: string;
    vaultBtcAddress: string;
    id: string;
    btcTxId: string;
    issueRequests: Map<string, IssueRequest[]>;
    wizardInEditMode: boolean;
    vaultIssues: VaultIssue[];
}
