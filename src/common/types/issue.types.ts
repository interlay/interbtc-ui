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
  // TODO: use current account from general state
  address: string;
  // current step in the wizard
  step: string;
  // id of the current issue request
  id: string;
  // mapping of all issue requests
  issueRequests: Map<string, IssueRequest[]>;
  // issue period in seconds
  issuePeriod: number;
}
