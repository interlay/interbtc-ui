export interface IssueRequest {
  id: string;
  requestedAmountPolkaBTC: string;
  timestamp?: string;
  totalAmount: string;
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
  // eslint-disable-next-line no-unused-vars
  Completed,
  // eslint-disable-next-line no-unused-vars
  Cancelled,
  // eslint-disable-next-line no-unused-vars
  RequestedRefund,
  // eslint-disable-next-line no-unused-vars
  Expired,
  // eslint-disable-next-line no-unused-vars
  PendingWithBtcTxNotFound,
  // eslint-disable-next-line no-unused-vars
  PendingWithBtcTxNotIncluded,
  // eslint-disable-next-line no-unused-vars
  PendingWithTooFewConfirmations,
  // eslint-disable-next-line no-unused-vars
  PendingWithEnoughConfirmations,
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
