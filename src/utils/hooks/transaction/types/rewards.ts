import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '.';
import { TransactionAction } from '.';

interface RewardsWithdrawAction extends TransactionAction {
  type: Transaction.REWARDS_WITHDRAW;
  args: Parameters<InterBtcApi['rewards']['withdrawRewards']>;
}

type RewardsActions = RewardsWithdrawAction;

export type { RewardsActions };
