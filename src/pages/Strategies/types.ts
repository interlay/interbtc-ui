enum StrategyRisk {
  LOW = 'low',
  MEDIUM = 'medium',
  MEDIUM_HIGH = 'medium-high',
  HIGH = 'high'
}

enum StrategySlug {
  BTC_LOW_RISK = 'btc-low-risk',
  BTC_LEVERAGE_LONG = 'btc-leverage-long'
}

enum StrategyType {
  PASSIVE_INCOME,
  LEVERAGE_LONG
}

enum StrategyFormType {
  DEPOSIT,
  WITHDRAW
}

export { StrategyFormType, StrategyRisk, StrategySlug, StrategyType };
