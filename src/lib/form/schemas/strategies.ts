const STRATEGY_DEPOSIT_AMOUNT_FIELD = 'strategy-deposit-amount';
const STRATEGY_DEPOSIT_FEE_TOKEN_FIELD = 'strategy-deposit-fee-token';

type StrategyDepositFormData = {
  [STRATEGY_DEPOSIT_AMOUNT_FIELD]?: string;
  [STRATEGY_DEPOSIT_FEE_TOKEN_FIELD]?: string;
};

const STRATEGY_WITHDRAW_AMOUNT_FIELD = 'strategy-withdraw-amount';
const STRATEGY_WITHDRAW_FEE_TOKEN_FIELD = 'strategy-withdraw-fee-token';

type StrategyWithdrawFormData = {
  [STRATEGY_WITHDRAW_AMOUNT_FIELD]?: string;
  [STRATEGY_WITHDRAW_FEE_TOKEN_FIELD]?: string;
};

export {
  STRATEGY_DEPOSIT_AMOUNT_FIELD,
  STRATEGY_DEPOSIT_FEE_TOKEN_FIELD,
  STRATEGY_WITHDRAW_AMOUNT_FIELD,
  STRATEGY_WITHDRAW_FEE_TOKEN_FIELD
};
export type { StrategyDepositFormData, StrategyWithdrawFormData };
