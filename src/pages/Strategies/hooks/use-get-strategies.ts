import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useCallback, useMemo } from 'react';

import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { useGetLoanAssets } from '@/hooks/api/loans/use-get-loan-assets';

import { StrategyRisk, StrategyType } from '../types';

type StrategyData = {
  type: StrategyType;
  risk: StrategyRisk;
  currency: CurrencyExt;
  interestRate: Big;
  loanAsset: LoanAsset;
};

type UseGetStrategiesResult = {
  isLoading: boolean;
  data: StrategyData[] | undefined;
  getStrategy: (type: StrategyType) => StrategyData | undefined;
};

const useGetStrategies = (): UseGetStrategiesResult => {
  const { data: loanAssets, isLoading } = useGetLoanAssets();

  const data: StrategyData[] | undefined = useMemo(
    () =>
      loanAssets &&
      // eslint-disable-next-line array-callback-return
      Object.values(StrategyType).map((type) => {
        switch (type) {
          case StrategyType.BTC_LOW_RISK: {
            const currency = WRAPPED_TOKEN;
            const loanAsset = loanAssets[currency.ticker];

            return {
              type,
              currency,
              risk: StrategyRisk.LOW,
              interestRate: loanAsset.lendApy,
              loanAsset
            };
          }
        }
      }),
    [loanAssets]
  );

  const getStrategy = useCallback((type: StrategyType) => data?.find((item) => item.type === type), [data]);

  return {
    isLoading,
    data,
    getStrategy
  };
};

export { useGetStrategies };
export type { StrategyData, UseGetStrategiesResult };
