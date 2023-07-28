import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { WRAPPED_TOKEN } from '@/config/relay-chains';

import { StrategyType } from '../types';

type StrategyPositionData = {
  amount: MonetaryAmount<CurrencyExt>;
  earnedAmount: MonetaryAmount<CurrencyExt>;
};

type UseGetStrategyPositionResult = {
  isLoading: boolean;
  data: StrategyPositionData | undefined;
};

const useGetStrategyPosition = (type: StrategyType): UseGetStrategyPositionResult => {
  switch (type) {
    case StrategyType.BTC_LOW_RISK:
      return {
        data: {
          amount: newMonetaryAmount(0, WRAPPED_TOKEN),
          earnedAmount: newMonetaryAmount(0, WRAPPED_TOKEN)
        },
        isLoading: false
      };
  }
};

export { useGetStrategyPosition };
export type { StrategyPositionData, UseGetStrategyPositionResult };
