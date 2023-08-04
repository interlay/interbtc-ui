import { CurrencyExt, LiquidityPool, LpCurrency } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { Prices } from '../../hooks/api/use-get-prices';
import { calculateTotalLiquidityUSD } from './pool';

const getPooledTickers = (liquidityPools: LiquidityPool[]): Set<string> =>
  liquidityPools.reduce((acc, pool) => {
    pool.pooledCurrencies.forEach((curr) => acc.add(curr.currency.ticker));

    return acc;
  }, new Set<string>());

const getFarmingApr = (
  rewardAmountsYearly: Array<MonetaryAmount<CurrencyExt>>,
  lpTotalSupply: MonetaryAmount<LpCurrency>,
  totalLiquidityUSD: number,
  prices: Prices | undefined
): Big => {
  if (prices === undefined || lpTotalSupply.toBig().eq(0) || totalLiquidityUSD === 0) {
    return new Big(0);
  }
  const totalRewardsPerTokenUSD = calculateTotalLiquidityUSD(rewardAmountsYearly, prices);

  const farmingApr = new Big(totalRewardsPerTokenUSD).div(totalLiquidityUSD).mul(100);

  return farmingApr;
};

export { getFarmingApr, getPooledTickers };
