import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '../types';

interface IssueRequestAction {
  type: Transaction.ISSUE_REQUEST;
  args: Parameters<InterBtcApi['issue']['request']>;
}

interface IssueExecuteAction {
  type: Transaction.ISSUE_EXECUTE;
  args: Parameters<InterBtcApi['issue']['execute']>;
}

type IssueActions = IssueRequestAction | IssueExecuteAction;

export type { IssueActions };
