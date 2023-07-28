type StrategyFormType = 'deposit' | 'withdraw';

enum StrategyRisk {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

enum StrategyType {
  BTC_LOW_RISK = 'btc-low-risk'
}

export { StrategyRisk, StrategyType };
export type { StrategyFormType };
