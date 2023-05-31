type StrategyFormType = 'deposit' | 'withdraw';
type StrategyRiskVariant = 'low' | 'high';

interface StrategyDepositFormData {
  deposit?: string;
}

interface StrategyWithdrawalFormData {
  withdraw?: string;
  withdrawAsWrapped?: boolean;
}

export type { StrategyDepositFormData, StrategyFormType, StrategyRiskVariant, StrategyWithdrawalFormData };
