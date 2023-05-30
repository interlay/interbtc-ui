type EarnStrategyFormType = 'deposit' | 'withdraw';
type EarnStrategyRiskVariant = 'low' | 'high';

interface EarnStrategyDepositFormData {
  deposit?: string;
}

interface EarnStrategyWithdrawalFormData {
  withdraw?: string;
  withdrawAsWrapped?: boolean;
}

export type {
  EarnStrategyDepositFormData,
  EarnStrategyFormType,
  EarnStrategyRiskVariant,
  EarnStrategyWithdrawalFormData
};
