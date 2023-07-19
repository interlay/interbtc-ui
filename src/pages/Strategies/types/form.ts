import { StrategyType } from './strategies';

type StrategyFormType = 'deposit' | 'withdraw';

interface StrategyFormProps {
  strategyType: StrategyType;
}

export type { StrategyFormProps, StrategyFormType };
