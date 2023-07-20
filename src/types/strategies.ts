import { CurrencyExt } from '@interlay/interbtc-api';
import Big from 'big.js';

enum StrategyRisk {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

type StrategyData = {
  interestType: 'apy' | 'apr';
  interestPercentage: Big;
  risk: StrategyRisk;
  currency: CurrencyExt;
};

export { StrategyRisk };
export type { StrategyData };
