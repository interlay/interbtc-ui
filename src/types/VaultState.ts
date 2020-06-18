export type Redeem = {
  id: string,
  amount: string,
  creation: string,
  tx_id: string,
  confirmations: number,
}

export interface VaultProps {
  redeems: Redeem[];
}
