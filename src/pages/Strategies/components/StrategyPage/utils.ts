import { STRATEGIES, Strategy, StrategyType } from '@/types/strategies';

const getStrategyTypeFromUrlPath = (strategyTypePath: string): StrategyType | undefined =>
  (Object.entries(STRATEGIES) as [StrategyType, Strategy][]).find(([, { path }]) => path === strategyTypePath)?.[0];

export { getStrategyTypeFromUrlPath };
