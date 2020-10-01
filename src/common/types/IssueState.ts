import { StorageInterface, KVStorageInterface } from "./Storage";

export type IssueRequest = {
    id: string;
    amountBTC: string;
    vaultBTCAddress: string;
    btcTxId: string;
    confirmations: number;
    completed: boolean;
    creation: string;
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
