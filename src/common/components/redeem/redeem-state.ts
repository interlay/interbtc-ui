import { StorageInterface, KVStorageInterface } from "../../types/Storage";

export type RedeemRequest = {
    id: string;
    amountPolkaBTC: string;
    creation: string;
    vaultAddress: string;
    vaultBTCAddress: string;
    redeemAddress: string;
    btcTxId: string;
    confirmations: number;
    completed: boolean;
};

export interface RedeemProps {
    balancePolkaBTC: string;
    balanceDOT: string;
    redeemRequests: Array<RedeemRequest>;
    showWizard: boolean;
    idCounter: number;
    storage?: StorageInterface;
    kvstorage: KVStorageInterface;
    resetRedeemWizard?: () => void;
}
