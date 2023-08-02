import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '.';

interface StrategiesDepositAction {
  type: Transaction.STRATEGIES_DEPOSIT;
  args: Parameters<InterBtcApi['loans']['lend']>;
}

interface StrategiesWithdrawAction {
  type: Transaction.STRATEGIES_WITHDRAW;
  args: Parameters<InterBtcApi['loans']['withdraw']>;
}

interface StrategiesWithdrawAllAction {
  type: Transaction.STRATEGIES_ALL_WITHDRAW;
  args: Parameters<InterBtcApi['loans']['withdrawAll']>;
}

type StrategiesActions = StrategiesDepositAction | StrategiesWithdrawAction | StrategiesWithdrawAllAction;

export type { StrategiesActions };
