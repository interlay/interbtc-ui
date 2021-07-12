export interface IssueRequest {
  id: string;
  requestedAmountPolkaBTC: string;
  timestamp?: string;
  amountBTC: string;
  creation: string;
  vaultBTCAddress: string;
  vaultDOTAddress: string;
  userDOTAddress: string;
  btcTxId: string;
  confirmations: number;
  status: IssueRequestStatus;
  merkleProof?: string;
  transactionBlockHeight?: number;
  rawTransaction?: Uint8Array;
  fee: string;
  griefingCollateral: string;
  refundBtcAddress: string;
  refundAmountBtc: string;
  issuedAmountBtc: string;
  btcAmountSubmittedByUser: string;
}

export enum IssueRequestStatus {
  Completed,
  Cancelled,
  RequestedRefund,
  Expired,
  PendingWithBtcTxNotFound,
  PendingWithBtcTxNotIncluded,
  PendingWithTooFewConfirmations,
  PendingWithEnoughConfirmations
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

export interface IssueState {
  // ray test touch <
  // TODO: use current account from general state
  address: string;
  // ray test touch >
  // mapping of all issue requests
  issueRequests: Map<string, IssueRequest[]>;
  // issue period in seconds
  issuePeriod: number;
}
