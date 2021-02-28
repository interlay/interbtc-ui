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
  // eslint-disable-next-line no-unused-vars
  Completed,
  // eslint-disable-next-line no-unused-vars
  Expired,
  // eslint-disable-next-line no-unused-vars
  Reimbursed,
  // eslint-disable-next-line no-unused-vars
  Retried,
  // eslint-disable-next-line no-unused-vars
  PendingWithBtcTxNotFound,
  // eslint-disable-next-line no-unused-vars
  PendingWithBtcTxNotIncluded,
  // eslint-disable-next-line no-unused-vars
  PendingWithTooFewConfirmations,
  // eslint-disable-next-line no-unused-vars
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
