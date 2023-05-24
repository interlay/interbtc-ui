import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '../types';
import { TransactionAction } from '.';

interface ReplaceRequestAction extends TransactionAction {
  type: Transaction.REPLACE_REQUEST;
  args: Parameters<InterBtcApi['replace']['request']>;
}

type ReplaceActions = ReplaceRequestAction;

export type { ReplaceActions };
