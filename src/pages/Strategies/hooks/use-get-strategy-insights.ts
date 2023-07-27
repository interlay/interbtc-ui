import { CurrencyExt, isCurrencyEqual, LoanAsset, newMonetaryAmount, TickerToData } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { AccountPositionsData, useGetAccountPositions } from '@/hooks/api/loans/use-get-account-positions';
import { useGetLoanAssets } from '@/hooks/api/loans/use-get-loan-assets';
import { STRATEGIES, StrategyType } from '@/types/strategies';

type UseGetStrategyInsights =
  | {
      depositedAmount: MonetaryAmount<CurrencyExt>;
      interest: number;
      earnedAmount: MonetaryAmount<CurrencyExt>;
    }
  | Record<string, never>;

const getStrategyInsights = (
  strategyType: StrategyType,
  loanAssets: TickerToData<LoanAsset> | undefined,
  loanPositions: Partial<AccountPositionsData> | undefined
): UseGetStrategyInsights => {
  switch (strategyType) {
    case StrategyType.BTC_LOW_RISK: {
      const { currency } = STRATEGIES[strategyType];
      const wrappedLendPosition = loanPositions?.lendPositions?.find(({ amount: { currency: positionCurrency } }) =>
        isCurrencyEqual(positionCurrency, currency)
      );

      if (!loanAssets) {
        return {};
      }

      return {
        depositedAmount: wrappedLendPosition?.amount || newMonetaryAmount(0, currency),
        earnedAmount: wrappedLendPosition?.earnedAmount || newMonetaryAmount(0, currency),
        interest: loanAssets[currency.ticker].lendApy.toNumber()
      };
    }
  }
};

const useGetStrategyInsights = (strategyType: StrategyType): UseGetStrategyInsights => {
  const { data: loanAssets } = useGetLoanAssets();
  const { data: loanPositions } = useGetAccountPositions();

  return getStrategyInsights(strategyType, loanAssets, loanPositions);
};

export { useGetStrategyInsights };
