import { InterBtcApi } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';

import { StrategyType } from '@/pages/Strategies/types';

import { Transaction } from '.';

interface StrategiesInitializeProxyAction {
  type: Transaction.STRATEGIES_INITIALIZE_PROXY;
  args: [StrategyType];
}

interface StrategiesDepositAction {
  type: Transaction.STRATEGIES_DEPOSIT;
  args: [StrategyType, AccountId, boolean, ...Parameters<InterBtcApi['loans']['lend']>];
}

interface StrategiesWithdrawAction {
  type: Transaction.STRATEGIES_WITHDRAW;
  args: [StrategyType, AccountId, ...Parameters<InterBtcApi['loans']['withdraw']>];
}

interface StrategiesWithdrawAllAction {
  type: Transaction.STRATEGIES_ALL_WITHDRAW;
  args: [StrategyType, AccountId, ...Parameters<InterBtcApi['loans']['withdraw']>];
}

type StrategiesActions =
  | StrategiesInitializeProxyAction
  | StrategiesDepositAction
  | StrategiesWithdrawAction
  | StrategiesWithdrawAllAction;

export type { StrategiesActions };
