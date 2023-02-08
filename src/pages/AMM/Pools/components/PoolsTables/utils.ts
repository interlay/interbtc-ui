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
  const lpTokenPriceUSD = new Big(totalLiquidityUSD).div(lpTotalSupply.toBig());

  const totalRewardsPerTokenUSD = calculateTotalLiquidityUSD(rewardAmountsYearly, prices);

  const yearlyRewardPerLPRatePercentage = new Big(totalRewardsPerTokenUSD).div(lpTokenPriceUSD).mul(100);

  return yearlyRewardPerLPRatePercentage;
};

export { getFarmingApr };
