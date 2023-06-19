import { CurrencyExt, LiquidityPool } from '@interlay/interbtc-api';
import { InterBtc, Interlay, KBtc, Kintsugi, Kusama, MonetaryAmount, Polkadot } from '@interlay/monetary-js';
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

const canBeSwappedForNativeCurrency = (pools: Array<LiquidityPool>) => (currency: CurrencyExt): boolean => {
  const trade = window.bridge.amm.getOptimalTrade(new MonetaryAmount(currency, 1), GOVERNANCE_TOKEN, pools);
  return trade !== null;
};

const canBeUsedAsIssueGriefingCollateral = (currency: CurrencyExt): boolean => {
  // TODO: determine which currencies can be used as griefing collateral
  const constantlySetForTestGriefingCollateralTickers = [Kintsugi, Interlay, Kusama, Polkadot, InterBtc, KBtc].map(
    ({ ticker }) => ticker
  );
  return constantlySetForTestGriefingCollateralTickers.includes(currency.ticker);
};

enum SelectCurrencyFilter {
  TRADEABLE_FOR_NATIVE_CURRENCY = 'TRADEABLE_FOR_NATIVE_CURRENCY',
  ISSUE_GRIEFING_COLLATERAL_CURRENCY = 'ISSUE_GRIEFING_COLLATERAL_CURRENCY'
}

const useSelectCurrency = (filter?: SelectCurrencyFilter): SelectCurrencyResult => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const { data: currencies } = useGetCurrencies(bridgeLoaded);

  const { getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();

  const { data: pools } = useGetLiquidityPools();

  const filteredCurrencies = useMemo(() => {
    if (currencies === undefined) {
      return [];
    }
    switch (filter) {
      case SelectCurrencyFilter.TRADEABLE_FOR_NATIVE_CURRENCY: {
        if (pools === undefined) {
          return [];
        }
        return currencies.filter(canBeSwappedForNativeCurrency(pools));
      }
      case SelectCurrencyFilter.ISSUE_GRIEFING_COLLATERAL_CURRENCY: {
        return currencies.filter(canBeUsedAsIssueGriefingCollateral);
      }
      default:
        return currencies;
    }
  }, [currencies, pools, filter]);

  const items = useMemo(
    () =>
      filteredCurrencies.map((currency) => {
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
    [filteredCurrencies, getAvailableBalance, prices]
  );

  return {
    items
  };
};

export { SelectCurrencyFilter, useSelectCurrency };
export type { SelectCurrencyResult };
