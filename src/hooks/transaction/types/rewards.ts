import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '.';

interface RewardsWithdrawAction {
  type: Transaction.REWARDS_WITHDRAW;
  args: Parameters<InterBtcApi['rewards']['withdrawRewards']>;
}

type RewardsActions = RewardsWithdrawAction;

export type { RewardsActions };
