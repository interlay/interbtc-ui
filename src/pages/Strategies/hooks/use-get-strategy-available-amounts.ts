import {
  useGetLoanAvailableAmounts,
  UseGetLoanAvailableAmountsData
} from '@/hooks/api/loans/use-get-loan-available-amounts';

import { StrategyFormType, StrategyType } from '../types';
import { StrategyData } from './use-get-strategies';
import { StrategyPositionData } from './use-get-strategy-position';

type useGetStrategyAvailableAmountsResult = UseGetLoanAvailableAmountsData;

const useGetStrategyAvailableAmounts = (
  type: StrategyFormType,
  strategy: StrategyData,
  position?: StrategyPositionData
): useGetStrategyAvailableAmountsResult => {
  const { data: loanFormData } = useGetLoanAvailableAmounts(
    type === StrategyFormType.DEPOSIT ? 'lend' : 'withdraw',
    strategy.loanAsset,
    position?.loanPosition
  );

  switch (strategy.type) {
    case StrategyType.BTC_LOW_RISK: {
      return loanFormData;
    }
  }
};

export { useGetStrategyAvailableAmounts };
