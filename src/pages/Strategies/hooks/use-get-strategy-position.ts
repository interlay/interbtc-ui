import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { useGetAccountPositions } from '@/hooks/api/loans/use-get-account-positions';
import { CollateralPosition } from '@/types/loans';

import { StrategyType } from '../types';
import { StrategyData } from './use-get-strategies';

type StrategyPositionData = {
  amount: MonetaryAmount<CurrencyExt>;
  earnedAmount?: MonetaryAmount<CurrencyExt>;
  loanPosition: CollateralPosition;
};

type UseGetStrategyPositionResult = {
  isLoading: boolean;
  data: StrategyPositionData | undefined;
};

const useGetStrategyPosition = (strategy: StrategyData | undefined): UseGetStrategyPositionResult => {
  const { getLendPosition, isLoading: isAccountPositionsLoading } = useGetAccountPositions();

  if (!strategy) {
    return {
      data: undefined,
      isLoading: true
    };
  }

  switch (strategy.type) {
    case StrategyType.BTC_LEVERAGE_LONG:
    case StrategyType.BTC_LOW_RISK: {
      if (isAccountPositionsLoading) {
        return {
          data: undefined,
          isLoading: true
        };
      }

      const position = getLendPosition(strategy.currency);

      if (!position) {
        return {
          data: undefined,
          isLoading: false
        };
      }

      return {
        data: {
          amount: position.amount,
          earnedAmount: position.earnedAmount,
          loanPosition: position
        },
        isLoading: false
      };
    }
  }
};

export { useGetStrategyPosition };
export type { StrategyPositionData, UseGetStrategyPositionResult };
