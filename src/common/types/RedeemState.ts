import { StorageInterface, KVStorageInterface } from "./Storage";

export type RedeemRequest = {
  id: string,
  amount: string,
  creation: string,
  vaultAddress: string,
  vaultBTCAddress: string,
  redeemAddress: string,
  btcTx: string,
  confirmations: number,
  completed: boolean
}

export interface RedeemProps {
  balancePolkaBTC: string;
  balanceDOT: string;
  redeemRequests: Array<RedeemRequest>;
  showWizard: boolean,
  idCounter: number,
  storage?: StorageInterface,
  kvstorage: KVStorageInterface,
}
