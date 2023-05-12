import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '../types';
import { TransactionAction } from '.';

interface IssueRequestAction extends TransactionAction {
  type: Transaction.ISSUE_REQUEST;
  args: Parameters<InterBtcApi['issue']['request']>;
}

interface IssueExecuteAction extends TransactionAction {
  type: Transaction.ISSUE_EXECUTE;
  args: Parameters<InterBtcApi['issue']['execute']>;
}

type IssueActions = IssueRequestAction | IssueExecuteAction;

export type { IssueActions };
