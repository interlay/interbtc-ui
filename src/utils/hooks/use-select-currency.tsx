import { CurrencyExt, LiquidityPool } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { TokenData } from '@/component-library';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';

import { getCoinIconProps } from '../helpers/coin-icon';
import { getTokenPrice } from '../helpers/prices';
import { useGetLiquidityPools } from './api/amm/use-get-liquidity-pools';
import { useGetOracleCurrencies } from './api/oracle/use-get-oracle-currencies';
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

const canBeUsedAsIssueGriefingCollateral = (oracleCurrencies: Array<CurrencyExt>) => (
  currency: CurrencyExt
): boolean => {
  return oracleCurrencies.map(({ ticker }) => ticker).includes(currency.ticker);
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
  const { data: oracleCurrencies } = useGetOracleCurrencies();

  const filteredCurrencies = useMemo(() => {
    if (!currencies) {
      return [];
    }

    switch (filter) {
      case SelectCurrencyFilter.TRADEABLE_FOR_NATIVE_CURRENCY: {
        if (!pools?.length) {
          return [GOVERNANCE_TOKEN];
        }

        return currencies.filter(canBeSwappedForNativeCurrency(pools));
      }
      case SelectCurrencyFilter.ISSUE_GRIEFING_COLLATERAL_CURRENCY: {
        if (!oracleCurrencies?.length) {
          return [GOVERNANCE_TOKEN];
        }

        return currencies.filter(canBeUsedAsIssueGriefingCollateral(oracleCurrencies));
      }
      default:
        return currencies;
    }
  }, [currencies, pools, filter, oracleCurrencies]);

  const items = useMemo(() => {
    let parsedTokenData = filteredCurrencies.map((currency) => {
      const balance = getAvailableBalance(currency.ticker);
      const balanceUSD = balance
        ? convertMonetaryAmountToValueInUSD(balance, getTokenPrice(prices, currency.ticker)?.usd)
        : 0;

      return {
        balance: balance?.toBig() || Big(0),
        balanceUSD: formatUSD(balanceUSD || 0, { compact: true }),
        value: currency.ticker,
        ...getCoinIconProps(currency)
      };
    });

    if (!filter) {
      parsedTokenData = parsedTokenData.sort((currencyA, currencyB) =>
        currencyB.balance.sub(currencyA.balance).toNumber()
      );
    }

    return parsedTokenData.map((currency) => ({ ...currency, balance: currency.balance.toString() }));
  }, [filteredCurrencies, getAvailableBalance, filter, prices]);

  return {
    items
  };
};

export { SelectCurrencyFilter, useSelectCurrency };
export type { SelectCurrencyResult };
