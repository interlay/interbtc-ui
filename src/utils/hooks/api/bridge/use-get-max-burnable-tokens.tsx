import { CollateralCurrencyExt, isCurrencyEqual } from '@interlay/interbtc-api';
import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import useAccountId from '../../use-account-id';
import { useGetCollateralCurrencies } from '../use-get-collateral-currencies';

type MaxBurnableTokensData = {
  amounts: MonetaryAmount<Currency>[];
  hasBurnableTokens: boolean;
};

const getMaxBurnableTokensData = async (currencies: CollateralCurrencyExt[]): Promise<MaxBurnableTokensData> => {
  const amounts = await Promise.all(currencies.map((currency) => window.bridge.redeem.getMaxBurnableTokens(currency)));

  return {
    amounts,
    hasBurnableTokens: !!amounts?.find((amount) => !amount.isZero())
  };
};

type UseGetMaxBurnableTokensResult = {
  data: MaxBurnableTokensData | undefined;
  getMaxBurnableTokens: (currency: Currency) => MonetaryAmount<Currency> | undefined;
  refetch: () => void;
};

const useGetMaxBurnableTokens = (): UseGetMaxBurnableTokensResult => {
  const { data: collateralCurrencies } = useGetCollateralCurrencies(true);

  const accountId = useAccountId();

  const { data, error, refetch } = useQuery({
    queryKey: ['max-burnable-tokens', accountId?.toString()],
    queryFn: () => collateralCurrencies && getMaxBurnableTokensData(collateralCurrencies),
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL,
    enabled: !!accountId && !!collateralCurrencies
  });

  useErrorHandler(error);

  const getMaxBurnableTokens = useCallback(
    (currency: Currency) => data?.amounts.find((amount) => isCurrencyEqual(amount.currency, currency)),
    [data?.amounts]
  );

  return {
    data,
    getMaxBurnableTokens,
    refetch
  };
};

export { useGetMaxBurnableTokens };
export type { MaxBurnableTokensData, UseGetMaxBurnableTokensResult };
