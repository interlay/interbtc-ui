export interface RedeemRequest {
  id: string;
  amountInterBTC: string;
  amountBTC: string;
  fee: string;
  btcTransferFee: string;
  timestamp: string;
  creation: string;
  userBTCAddress: string;
  userDOTAddress: string;
  vaultDOTAddress?: string;
  btcTxId: string;
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
  PendingWithEnoughConfirmations
}

export type DashboardRequestInfo = {
  id: string;
  timestamp: string;
  amountInterBTC: string;
  creation: string;
  vaultDotAddress: string;
  btcAddress: string;
  completed: boolean;
  cancelled: boolean;
  isExpired: boolean;
  reimbursed: boolean;
};

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
}
