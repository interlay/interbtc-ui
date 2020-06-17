export type RedeemRequest = {
  id: string,
  amount: string,
  creation: string,
  vaultAddress: string,
  btcTx: string,
  confirmations: number,
}

export interface RedeemProps {
  balancePolkaBTC: string;
  balanceDOT: string;
  redeemRequests: Array<RedeemRequest>;
  showWizard: boolean;
}
