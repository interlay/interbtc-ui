import { StorageInterface, KVStorageInterface } from "./Storage";

export type IssueRequest = {
  id: string;
  amountBTC: string;
  vaultBTCAddress: string;
  btcTxId: string;
  confirmations: number;
  completed: boolean;
  creation: string;
  merkleProof: string;
  transactionBlockHeight: number;
  rawTransaction: Uint8Array;
  issueRequestHash: string;
};

export interface IssueProps {
  balancePolkaBTC: string;
  balanceDOT: string;
  issueRequests: Array<IssueRequest>;
  lastissueRequestsUpdate: Date;
  showWizard: boolean;
  idCounter: number;
  storage?: StorageInterface;
  kvstorage: KVStorageInterface;
  addIssueRequest: (req: IssueRequest) => void;
  handleUpdatedIssueRequests: (updatedIssueRequests: Array<IssueRequest>) => void;
}
