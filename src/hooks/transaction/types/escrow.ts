import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '../types';

interface EscrowCreateLockAction {
  type: Transaction.ESCROW_CREATE_LOCK;
  args: Parameters<InterBtcApi['escrow']['createLock']>;
}

interface EscrowInscreaseLookedTimeAndAmountAction {
  type: Transaction.ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT;
  args: [
    ...Parameters<InterBtcApi['api']['tx']['escrow']['increaseAmount']>,
    ...Parameters<InterBtcApi['api']['tx']['escrow']['increaseUnlockHeight']>
  ];
}
interface EscrowIncreaseLockAmountAction {
  type: Transaction.ESCROW_INCREASE_LOCKED_AMOUNT;
  args: Parameters<InterBtcApi['escrow']['increaseAmount']>;
}

interface EscrowIncreaseLockTimeAction {
  type: Transaction.ESCROW_INCREASE_LOCKED_TIME;
  args: Parameters<InterBtcApi['escrow']['increaseUnlockHeight']>;
}

interface EscrowWithdrawRewardsAction {
  type: Transaction.ESCROW_WITHDRAW_REWARDS;
  args: Parameters<InterBtcApi['escrow']['withdrawRewards']>;
}

interface EscrowWithdrawAction {
  type: Transaction.ESCROW_WITHDRAW;
  args: Parameters<InterBtcApi['escrow']['withdraw']>;
}

type EscrowActions =
  | EscrowCreateLockAction
  | EscrowInscreaseLookedTimeAndAmountAction
  | EscrowIncreaseLockAmountAction
  | EscrowIncreaseLockTimeAction
  | EscrowWithdrawRewardsAction
  | EscrowWithdrawAction;

export type { EscrowActions };
