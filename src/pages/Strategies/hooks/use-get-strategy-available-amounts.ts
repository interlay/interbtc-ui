import {
  useGetLoanAvailableAmounts,
  UseGetLoanAvailableAmountsResult
} from '@/hooks/api/loans/use-get-loan-available-amounts';

import { StrategyFormType, StrategyType } from '../types';
import { StrategyData } from './use-get-strategies';
import { StrategyPositionData } from './use-get-strategy-position';

type UseGetStrategyAvailableAmountsResult = UseGetLoanAvailableAmountsResult;

const useGetStrategyAvailableAmounts = (
  type: StrategyFormType,
  strategy: StrategyData,
  position?: StrategyPositionData
): UseGetStrategyAvailableAmountsResult => {
  const loanAvailableAmounts = useGetLoanAvailableAmounts(
    type === StrategyFormType.DEPOSIT ? 'lend' : 'withdraw',
    strategy.loanAsset,
    position?.loanPosition
  );

  switch (strategy.type) {
    case StrategyType.PASSIVE_INCOME: {
      return loanAvailableAmounts;
    }
    case StrategyType.LEVERAGE_LONG: {
      return loanAvailableAmounts;
    }
  }
};

export { useGetStrategyAvailableAmounts };
export type { UseGetStrategyAvailableAmountsResult };
