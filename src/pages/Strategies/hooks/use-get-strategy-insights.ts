import { CurrencyExt, isCurrencyEqual, LoanAsset, newMonetaryAmount, TickerToData } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { StrategyType } from '@/types/strategies';
import { AccountPositionsData, useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
import { useGetLoanAssets } from '@/utils/hooks/api/loans/use-get-loan-assets';

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
      const wrappedLendPosition = loanPositions?.lendPositions?.find(({ amount: { currency } }) =>
        isCurrencyEqual(currency, WRAPPED_TOKEN)
      );

      if (!loanAssets) {
        return {};
      }

      return {
        depositedAmount: wrappedLendPosition?.amount || newMonetaryAmount(0, WRAPPED_TOKEN),
        // TODO: add real earned amount once it's added on lib side
        earnedAmount: newMonetaryAmount(0, WRAPPED_TOKEN),
        interest: loanAssets[WRAPPED_TOKEN.ticker].lendApy.toNumber()
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
