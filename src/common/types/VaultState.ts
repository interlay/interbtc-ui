export type Redeem = {
  id: string;
  amount: string;
  creation: string;
  tx_id: string;
  confirmations: number;
};

export interface VaultProps {
  balanceDOT: string;
  balanceLockedDOT: string;
  backedPolkaBTC: string;
  collateralRate: string;
  feesEarned: string;
  redeems: Redeem[];
}
