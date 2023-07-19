import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { UseLoanFormData, useLoanFormData } from '@/pages/Loans/LoansOverview/hooks/use-loan-form-data';
import { useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
import { useGetLoanAssets } from '@/utils/hooks/api/loans/use-get-loan-assets';

import { StrategyType } from '../types';
import { StrategyFormType } from '../types/form';

interface UseSimplePassiveIncomeData {
  minAmount: MonetaryAmount<CurrencyExt>;
  maxAmount: MonetaryAmount<CurrencyExt>;
}

const getStrategyParams = (strategyType: StrategyType) => {
  switch (strategyType) {
    case StrategyType.LOW_RISK_SIMPLE_WRAPPED:
      return {
        currency: WRAPPED_TOKEN
      };
  }
};

const getStrategyLimitAmounts = (
  strategyType: StrategyType,
  loanFormData: UseLoanFormData | Record<string, never>
): {
  minAmount: MonetaryAmount<CurrencyExt> | undefined;
  maxAmount: MonetaryAmount<CurrencyExt> | undefined;
} => {
  switch (strategyType) {
    case StrategyType.LOW_RISK_SIMPLE_WRAPPED:
      return { minAmount: loanFormData.assetAmount?.min, maxAmount: loanFormData.assetAmount?.available };
  }
};

const useStrategyFormData = (strategyType: StrategyType, formType: StrategyFormType): UseSimplePassiveIncomeData => {
  const { data } = useGetAccountPositions();
  const { data: loanAssets } = useGetLoanAssets();

  const { currency } = getStrategyParams(strategyType);
  const lendPosition = data?.lendPositions?.find((position) => position.amount.currency.ticker === currency.ticker);

  const loanFormData = useLoanFormData(
    formType === 'deposit' ? 'lend' : 'withdraw',
    loanAssets?.[currency.ticker],
    lendPosition
  );

  const { minAmount, maxAmount } = getStrategyLimitAmounts(strategyType, loanFormData);

  return {
    minAmount: minAmount || newMonetaryAmount(0, currency),
    maxAmount: maxAmount || newMonetaryAmount(0, currency)
  };
};

export { useStrategyFormData };
