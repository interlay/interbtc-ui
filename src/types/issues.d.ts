import { IssueStatus } from '@interlay/interbtc-api';

// Bare minimum for now
interface IssueRequest {
  id: string;
  backingPayment: {
    btcTxId: string;
  };
  vault: {
    accountId: string;
  };
}

interface IssueRequestWithStatusDecoded extends IssueRequest {
  status: IssueStatus;
}

export type { IssueRequest, IssueRequestWithStatusDecoded };
