export type IssueRequest = {
  id: string,
  amount: string,
  // creation: string,
  vaultAddress: string,
  btcTx: string,
  confirmations: number,
}

export interface IssueProps {
  balancePolkaBTC: string;
  balanceDOT: string;
  issueRequests: Array<IssueRequest>;
  showWizard: boolean;
}
