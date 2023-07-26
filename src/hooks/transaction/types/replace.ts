import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '.';

interface ReplaceRequestAction {
  type: Transaction.REPLACE_REQUEST;
  args: Parameters<InterBtcApi['replace']['request']>;
}

type ReplaceActions = ReplaceRequestAction;

export type { ReplaceActions };
