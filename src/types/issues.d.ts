// ray test touch <
import { IssueStatus } from '@interlay/interbtc-api';

// TODO: bare minimum for now
interface IssueRequest {
  id: string;
  backingPayment: {
    btcTxId: string;
  };
}

interface IssueRequestWithStatusDecoded extends IssueRequest {
  status: IssueStatus;
}

export type { IssueRequest, IssueRequestWithStatusDecoded };
// ray test touch >
