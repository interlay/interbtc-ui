import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useCallback, useMemo } from 'react';

import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { useGetLoanAssets } from '@/hooks/api/loans/use-get-loan-assets';
import { useGetCurrencies } from '@/hooks/api/use-get-currencies';

import { StrategyRisk, StrategySlug, StrategyType } from '../types';

type StrategySpecificData =
  | {
      type: StrategyType.PASSIVE_INCOME;
      currencies: {
        primary: CurrencyExt;
      };
    }
  | {
      type: StrategyType.LEVERAGE_LONG;
      currencies: {
        primary: CurrencyExt;
        secondary: CurrencyExt;
      };
    };

type StrategyData = {
  risk: StrategyRisk;
  slug: StrategySlug;
  interestRate: Big;
  loanAsset: LoanAsset;
} & StrategySpecificData;

type UseGetStrategiesResult = {
  isLoading: boolean;
  data: StrategyData[] | undefined;
  getStrategy: (slug: StrategySlug) => StrategyData | undefined;
};

const useGetStrategies = (): UseGetStrategiesResult => {
  const { data: loanAssets, isLoading } = useGetLoanAssets();
  const { getCurrencyFromTicker } = useGetCurrencies(true);

  const data: StrategyData[] | undefined = useMemo(
    () =>
      loanAssets &&
      Object.values(StrategySlug).map(
        // eslint-disable-next-line array-callback-return
        (slug): StrategyData => {
          switch (slug) {
            case StrategySlug.BTC_LOW_RISK: {
              const currency = WRAPPED_TOKEN;
              const loanAsset = loanAssets[currency.ticker];

              return {
                slug,
                type: StrategyType.PASSIVE_INCOME,
                currencies: {
                  primary: WRAPPED_TOKEN
                },
                risk: StrategyRisk.LOW,
                interestRate: loanAsset.lendApy,
                loanAsset
              };
            }
            case StrategySlug.BTC_LEVERAGE_LONG: {
              const currency = WRAPPED_TOKEN;
              const loanAsset = loanAssets[currency.ticker];

              return {
                slug,
                type: StrategyType.LEVERAGE_LONG,
                currencies: {
                  primary: WRAPPED_TOKEN,
                  secondary: getCurrencyFromTicker('USDT')
                },
                risk: StrategyRisk.MEDIUM_HIGH,
                interestRate: new Big(0),
                loanAsset
              };
            }
          }
        }
      ),
    [getCurrencyFromTicker, loanAssets]
  );

  const getStrategy = useCallback((slug: StrategySlug) => data?.find((item) => item.slug === slug), [data]);

  return {
    isLoading,
    data,
    getStrategy
  };
};

export { useGetStrategies };
export type { StrategyData, UseGetStrategiesResult };
