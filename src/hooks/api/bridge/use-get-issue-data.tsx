import { newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount, Currency, MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetCurrencies } from '../use-get-currencies';

type IssueData = {
  dustValue: MonetaryAmount<Currency>;
  issueFee: MonetaryAmount<Currency>;
  griefingCollateralRate: Big;
};

const getIssueData = async (): Promise<IssueData> => {
  const [issueFee, griefingCollateralRate, dustValue] = await Promise.all([
    window.bridge.fee.getIssueFee(),
    window.bridge.fee.getIssueGriefingCollateralRate(),
    window.bridge.issue.getDustValue()
  ]);

  return {
    dustValue,
    issueFee: new BitcoinAmount(issueFee),
    griefingCollateralRate
  };
};

type UseGetIssueDataResult = {
  data: IssueData | undefined;
  getSecurityDeposit: (
    btcAmount: MonetaryAmount<Currency>,
    ticker: string | undefined
  ) => Promise<MonetaryAmount<Currency> | undefined>;
  refetch: () => void;
};

const useGetIssueData = (): UseGetIssueDataResult => {
  const { getCurrencyFromTicker, isLoading: isLoadingCurrencies } = useGetCurrencies(true);

  const { data, error, refetch } = useQuery({
    queryKey: 'issue-data',
    queryFn: getIssueData,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  const getSecurityDeposit = useCallback(
    async (btcAmount: MonetaryAmount<Currency>, ticker: string | undefined) => {
      if (isLoadingCurrencies || ticker === undefined) {
        return;
      }
      const griefingCollateralCurrency = getCurrencyFromTicker(ticker);
      const btcToGriefingCollateralCurrency = await window.bridge.oracle.getExchangeRate(griefingCollateralCurrency);
      const { griefingCollateralRate } = data || {};

      if (!btcToGriefingCollateralCurrency || !griefingCollateralRate)
        return newMonetaryAmount(0, griefingCollateralCurrency);

      return btcToGriefingCollateralCurrency.toCounter(btcAmount).mul(griefingCollateralRate);
    },
    [data, getCurrencyFromTicker, isLoadingCurrencies]
  );

  return {
    data,
    refetch,
    getSecurityDeposit
  };
};

export { useGetIssueData };
export type { IssueData, UseGetIssueDataResult };
