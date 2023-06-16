import { CurrencyExt, LiquidityPool } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { TokenData } from '@/component-library';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';

import { getCoinIconProps } from '../helpers/coin-icon';
import { getTokenPrice } from '../helpers/prices';
import { useGetLiquidityPools } from './api/amm/use-get-liquidity-pools';
import { useGetBalances } from './api/tokens/use-get-balances';
import { useGetCurrencies } from './api/use-get-currencies';
import { useGetPrices } from './api/use-get-prices';

type SelectCurrencyResult = {
  items: TokenData[];
};

const canBeSwappedForNativeCurrency = (currency: CurrencyExt, pools: Array<LiquidityPool>): boolean => {
  const trade = window.bridge.amm.getOptimalTrade(new MonetaryAmount(currency, 1), GOVERNANCE_TOKEN, pools);
  return trade !== null;
};

const useSelectCurrency = (): SelectCurrencyResult => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const { data: currencies } = useGetCurrencies(bridgeLoaded);

  const { getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();

  const { data: pools } = useGetLiquidityPools();

  const currenciesWithSwapPath = useMemo(() => {
    if (currencies === undefined || pools === undefined) {
      return [];
    }
    return currencies.filter((currency) => canBeSwappedForNativeCurrency(currency, pools));
  }, [currencies, pools]);

  const items = useMemo(
    () =>
      currenciesWithSwapPath.map((currency) => {
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
      }),
    [currenciesWithSwapPath, getAvailableBalance, prices]
  );

  return {
    items
  };
};

export { useSelectCurrency };
export type { SelectCurrencyResult };
