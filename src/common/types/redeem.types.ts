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
    showWizard: boolean;
    resetRedeemWizard?: () => void;
}
