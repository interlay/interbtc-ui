import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '.';
import { TransactionAction } from '.';

interface VestingClaimAction extends TransactionAction {
  type: Transaction.VESTING_CLAIM;
  args: Parameters<InterBtcApi['api']['tx']['vesting']['claim']>;
}

type VestingActions = VestingClaimAction;

export type { VestingActions };
