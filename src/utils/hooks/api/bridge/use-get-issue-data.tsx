import { BitcoinAmount, Currency, MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetExchangeRate } from '../use-get-exchange-rate';

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
  getSecurityDeposit: (btcAmount: MonetaryAmount<Currency>) => MonetaryAmount<Currency> | undefined;
  refetch: () => void;
};

const useGetIssueData = (): UseGetIssueDataResult => {
  const { data: btcToGovernanceToken } = useGetExchangeRate(GOVERNANCE_TOKEN);

  const { data, error, refetch } = useQuery({
    queryKey: 'issue-data',
    queryFn: getIssueData,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  const getSecurityDeposit = useCallback(
    (btcAmount: MonetaryAmount<Currency>) => {
      const { griefingCollateralRate } = data || {};

      if (!btcToGovernanceToken || !griefingCollateralRate) return;

      return btcToGovernanceToken.toCounter(btcAmount).mul(griefingCollateralRate);
    },
    [btcToGovernanceToken, data]
  );

  return {
    data,
    refetch,
    getSecurityDeposit
  };
};

export { useGetIssueData };
export type { IssueData, UseGetIssueDataResult };
