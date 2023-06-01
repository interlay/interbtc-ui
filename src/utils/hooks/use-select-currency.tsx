import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { TokenData } from '@/component-library';

import { getCoinIconProps } from '../helpers/coin-icon';
import { getTokenPrice } from '../helpers/prices';
import { useGetBalances } from './api/tokens/use-get-balances';
import { useGetCurrencies } from './api/use-get-currencies';
import { useGetPrices } from './api/use-get-prices';

type SelectCurrencyResult = {
  items: TokenData[];
};

const useSelectCurrency = (): SelectCurrencyResult => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const { data: currencies } = useGetCurrencies(bridgeLoaded);

  const { getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();

  const items = useMemo(
    () =>
      currencies?.map((currency) => {
        const balance = getAvailableBalance(currency.ticker);
        const balanceUSD = balance
          ? convertMonetaryAmountToValueInUSD(balance, getTokenPrice(prices, currency.ticker)?.usd)
          : 0;

        return {
          balance: balance?.toHuman() || 0,
          balanceUSD: formatUSD(balanceUSD || 0, { compact: true }),
          value: currency.ticker,
          ...getCoinIconProps(currency)
        };
      }) || [],
    [currencies, getAvailableBalance, prices]
  );

  return {
    items
  };
};

export { useSelectCurrency };
export type { SelectCurrencyResult };
