import { StorageInterface, KVStorageInterface } from "./Storage";

export type IssueRequest = {
  id: string;
  amount: string;
  creation: string;
  vaultAddress: string;
  btcTx: string;
  confirmations: number;
  completed: boolean;
};

export interface IssueProps {
  balancePolkaBTC: string;
  balanceDOT: string;
  issueRequests: Array<IssueRequest>;
  showWizard: boolean;
  idCounter: number;
  storage?: StorageInterface;
  kvstorage: KVStorageInterface;
  addIssueRequest: (req: IssueRequest) => void;
}
