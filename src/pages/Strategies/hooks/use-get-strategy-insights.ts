import { CurrencyExt, isCurrencyEqual, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { AccountPositionsData, useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
import { useGetLoanAssets } from '@/utils/hooks/api/loans/use-get-loan-assets';

import { StrategyType } from '../types';

type UseGetStrategyInsights =
  | {
      depositedAmount: MonetaryAmount<CurrencyExt>;
      apy: number;
      earnedAmount: MonetaryAmount<CurrencyExt>;
    }
  | Record<string, never>;

const getStrategyInsights = (
  strategyType: StrategyType,
  loanAssets: TickerToData<LoanAsset> | undefined,
  loanPositions: Partial<AccountPositionsData> | undefined
): UseGetStrategyInsights => {
  switch (strategyType) {
    case StrategyType.LOW_RISK_SIMPLE_WRAPPED: {
      const wrappedLendPosition = loanPositions?.lendPositions?.find(({ amount: { currency } }) =>
        isCurrencyEqual(currency, WRAPPED_TOKEN)
      );

      if (!wrappedLendPosition || !loanAssets) {
        return {};
      }

      return {
        depositedAmount: wrappedLendPosition.amount,
        // TODO: add real earned amount once it's added on lib side
        earnedAmount: new MonetaryAmount(WRAPPED_TOKEN, 0),
        apy: loanAssets[WRAPPED_TOKEN.ticker].lendApy.toNumber()
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
