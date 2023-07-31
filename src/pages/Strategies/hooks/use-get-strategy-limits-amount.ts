import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { useGetAccountPositions } from '@/hooks/api/loans/use-get-account-positions';
import { useGetLoanAssets } from '@/hooks/api/loans/use-get-loan-assets';
import { useGetLoanLimitsAmount, UseGetLoanLimitsAmountData } from '@/hooks/api/loans/use-get-loan-limits-amount';

import { StrategyFormType, StrategyType } from '../types';

interface UseSimplePassiveIncomeData {
  minAmount: MonetaryAmount<CurrencyExt>;
  maxAmount: MonetaryAmount<CurrencyExt>;
}

const getStrategyParams = (strategyType: StrategyType) => {
  switch (strategyType) {
    case StrategyType.BTC_LOW_RISK:
      return {
        currency: WRAPPED_TOKEN
      };
  }
};

const getStrategyLimitAmounts = (
  strategyType: StrategyType,
  loanFormData: UseGetLoanLimitsAmountData | Record<string, never>
): {
  minAmount: MonetaryAmount<CurrencyExt> | undefined;
  maxAmount: MonetaryAmount<CurrencyExt> | undefined;
} => {
  switch (strategyType) {
    case StrategyType.BTC_LOW_RISK:
      return { minAmount: loanFormData.minAmount, maxAmount: loanFormData.maxAmount };
  }
};

const useGetStrategyLimitsAmount = (
  strategyType: StrategyType,
  formType: StrategyFormType
): UseSimplePassiveIncomeData => {
  const { data } = useGetAccountPositions();
  const { data: loanAssets } = useGetLoanAssets();

  const { currency } = getStrategyParams(strategyType);
  const lendPosition = data?.lendPositions?.find((position) => position.amount.currency.ticker === currency.ticker);

  const loanFormData = useGetLoanLimitsAmount(
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

export { useGetStrategyLimitsAmount };
