import { newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount, Currency, MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { Key, useCallback, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { TokenData } from '@/component-library';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import { SelectCurrencyFilter, useSelectCurrency } from '../../use-select-currency';
import { useGetCurrencies } from '../use-get-currencies';
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

interface GriefingCollateralCurrencyProps {
  value: string;
  onSelectionChange: (ticker: Key) => void;
  items: Array<TokenData>;
}

type UseGetIssueDataResult = {
  data: IssueData | undefined;
  getSecurityDeposit: (btcAmount: MonetaryAmount<Currency>) => MonetaryAmount<Currency>;
  refetch: () => void;
  griefingCollateralCurrencyProps: GriefingCollateralCurrencyProps;
};

const useGetIssueData = (): UseGetIssueDataResult => {
  const [griefingCollateralCurrency, setGriefingCollateralCurrency] = useState(GOVERNANCE_TOKEN);
  const { data: btcToGriefingCollateralCurrency } = useGetExchangeRate(griefingCollateralCurrency);

  const { getCurrencyFromTicker } = useGetCurrencies(true);

  const { items: griefingCollateralCurrencies } = useSelectCurrency(
    SelectCurrencyFilter.ISSUE_GRIEFING_COLLATERAL_CURRENCY
  );

  const { data, error, refetch } = useQuery({
    queryKey: 'issue-data',
    queryFn: getIssueData,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  const getSecurityDeposit = useCallback(
    (btcAmount: MonetaryAmount<Currency>) => {
      const { griefingCollateralRate } = data || {};

      if (!btcToGriefingCollateralCurrency || !griefingCollateralRate)
        return newMonetaryAmount(0, griefingCollateralCurrency);

      return btcToGriefingCollateralCurrency.toCounter(btcAmount).mul(griefingCollateralRate);
    },
    [btcToGriefingCollateralCurrency, data, griefingCollateralCurrency]
  );

  const handleGriefingCollateralCurrencyChange = (ticker: Key) => {
    const currency = getCurrencyFromTicker(ticker as string);

    if (!currency) return;

    setGriefingCollateralCurrency(currency);
  };

  return {
    data,
    refetch,
    getSecurityDeposit,
    griefingCollateralCurrencyProps: {
      value: griefingCollateralCurrency.ticker,
      onSelectionChange: handleGriefingCollateralCurrencyChange,
      items: griefingCollateralCurrencies
    }
  };
};

export { useGetIssueData };
export type { GriefingCollateralCurrencyProps, IssueData, UseGetIssueDataResult };
