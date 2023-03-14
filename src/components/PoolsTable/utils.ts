import { CurrencyExt, LpCurrency } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { calculateTotalLiquidityUSD } from '@/pages/AMM/shared/utils';
import { Prices } from '@/utils/hooks/api/use-get-prices';

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

export { getFarmingApr };
