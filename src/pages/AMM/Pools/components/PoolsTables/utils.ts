import { CurrencyExt, LpCurrency } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { calculateTotalLiquidityUSD } from '@/pages/AMM/shared/utils';
import { Prices } from '@/utils/hooks/api/use-get-prices';

const getFarmingApr = (
  rewardAmountsYearly: Array<MonetaryAmount<CurrencyExt>>,
  lpTotalSupply: MonetaryAmount<LpCurrency>,
  totalLiquidityUSD: number,
  prices: Prices | undefined
): number => {
  if (prices === undefined || lpTotalSupply.toBig().eq(0) || totalLiquidityUSD === 0) {
    return 0;
  }
  const lpTokenPriceUSD = totalLiquidityUSD / lpTotalSupply.toBig().toNumber();

  const totalRewardsPerTokenUSD = calculateTotalLiquidityUSD(rewardAmountsYearly, prices);

  const yearlyRewardPerLPRatePercentage = (totalRewardsPerTokenUSD / lpTokenPriceUSD) * 100;

  return yearlyRewardPerLPRatePercentage;
};

export { getFarmingApr };
