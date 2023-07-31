import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { useGetLoanLimitsAmount } from '@/hooks/api/loans/use-get-loan-limits-amount';

import { StrategyFormType, StrategyType } from '../types';
import { StrategyData } from './use-get-strategies';
import { StrategyPositionData } from './use-get-strategy-position';

interface UseSimplePassiveIncomeData {
  minAmount: MonetaryAmount<CurrencyExt>;
  maxAmount: MonetaryAmount<CurrencyExt>;
}

const useGetStrategyLimitsAmount = (
  type: StrategyFormType,
  strategy: StrategyData,
  position?: StrategyPositionData
): UseSimplePassiveIncomeData => {
  const loanFormData = useGetLoanLimitsAmount(
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

export { useGetStrategyLimitsAmount };
