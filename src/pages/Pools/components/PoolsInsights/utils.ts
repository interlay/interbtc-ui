import { CurrencyExt, LpCurrency } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { calculateTotalLiquidityUSD } from '@/utils/helpers/pool';
import { Prices } from '@/utils/hooks/api/use-get-prices';

const calculateClaimableFarmingRewardUSD = (
  claimableRewards: Map<LpCurrency, MonetaryAmount<CurrencyExt>[]> | undefined,
  prices: Prices | undefined
): number => {
  if (claimableRewards === undefined) {
    return 0;
  }
  const flattenedRewardAmounts: Array<MonetaryAmount<CurrencyExt>> = [];
  for (const [, rewardAmounts] of claimableRewards.entries()) {
    flattenedRewardAmounts.push(...rewardAmounts);
  }

  const totalRewardUSD = calculateTotalLiquidityUSD(flattenedRewardAmounts, prices);

  return totalRewardUSD;
};

export { calculateClaimableFarmingRewardUSD };
