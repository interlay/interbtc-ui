import { CurrencyExt } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useCallback, useMemo } from 'react';

import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { useGetAccountPositions } from '@/hooks/api/loans/use-get-account-positions';
import { useGetLoanAssets } from '@/hooks/api/loans/use-get-loan-assets';

import { StrategyRisk, StrategyType } from '../types';

type StrategyData = {
  type: StrategyType;
  risk: StrategyRisk;
  currency: CurrencyExt;
  interest: Big;
};

type UseGetStrategiesResult = {
  isLoading: boolean;
  data: StrategyData[] | undefined;
  getStrategy: (type: StrategyType) => StrategyData | undefined;
};

const useGetStrategies = (): UseGetStrategiesResult => {
  const { data: loanAssets } = useGetLoanAssets();
  const { data: loanPositions } = useGetAccountPositions();

  const data: StrategyData[] | undefined = useMemo(
    () =>
      loanAssets &&
      loanPositions &&
      Object.values(StrategyType).map((type) => {
        switch (type) {
          case StrategyType.BTC_LOW_RISK: {
            const currency = WRAPPED_TOKEN;

            return {
              // TODO: add real earned amount once it's added on lib side
              type,
              currency,
              interest: loanAssets[currency.ticker].lendApy,
              risk: StrategyRisk.LOW
            };
          }
        }
      }),
    [loanAssets, loanPositions]
  );

  const getStrategy = useCallback((type: StrategyType) => data?.find((item) => item.type === type), [data]);

  return {
    isLoading: !loanAssets || !loanPositions,
    data,
    getStrategy
  };
};

export { useGetStrategies };
export type { StrategyData, UseGetStrategiesResult };
