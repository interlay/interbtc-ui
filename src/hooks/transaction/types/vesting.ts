import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '.';

interface VestingClaimAction {
  type: Transaction.VESTING_CLAIM;
  args: Parameters<InterBtcApi['api']['tx']['vesting']['claim']>;
}

type VestingActions = VestingClaimAction;

export type { VestingActions };
