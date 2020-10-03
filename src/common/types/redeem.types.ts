export type RedeemRequest = {
    id: string;
    amountPolkaBTC: string;
    creation: Date;
    vaultBTCAddress: string;
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
    resetRedeemWizard?: () => void;
}
