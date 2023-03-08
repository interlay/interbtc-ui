import {
  BorrowPosition,
  CurrencyExt,
  LendingStats,
  LendPosition,
  LoanAsset,
  TickerToData
} from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useMemo } from 'react';

import { convertMonetaryAmountToValueInUSD, convertMonetaryBtcToUSD } from '@/common/utils/utils';
import { getSubsidyRewardApy } from '@/pages/Loans/LoansOverview/utils/get-subsidy-rewards-apy';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetLoanAssets } from '@/utils/hooks/api/loans/use-get-loan-assets';

import { Prices, useGetPrices } from '../use-get-prices';
import { useGetAccountPositions } from './use-get-account-positions';
import { useGetAccountSubsidyRewards } from './use-get-account-subsidy-rewards';

interface AccountLendingStatistics extends LendingStats {
  supplyAmountUSD: Big;
  borrowAmountUSD: Big;
  collateralizedAmountUSD: Big;
  earnedInterestAmountUSD: Big;
  netAmountUSD: Big;
  netAPY: Big;
}

const getNetAPY = (
  lendPositions: LendPosition[],
  borrowPositions: BorrowPosition[],
  assets: TickerToData<LoanAsset>,
  supplyAmountUSD: Big,
  prices: Prices
): Big => {
  if (!supplyAmountUSD.gt(0)) {
    return new Big(0);
  }

  const totalLendApy = lendPositions.reduce((total, position) => {
    const { lendApy, lendReward } = assets[position.currency.ticker];
    const rewardsApy = getSubsidyRewardApy(position.currency, lendReward, prices);
    const positionApy = lendApy.add(rewardsApy || 0);
    const positionUSDValue = convertMonetaryAmountToValueInUSD(
      position.amount,
      getTokenPrice(prices, position.currency.ticker)?.usd
    );

    return positionUSDValue ? total.add(positionApy.mul(positionUSDValue)) : total;
  }, new Big(0));

  const totalBorrowApy = borrowPositions.reduce((total, position) => {
    const { borrowApy, borrowReward } = assets[position.currency.ticker];
    const rewardsApy = getSubsidyRewardApy(position.currency, borrowReward, prices);
    const positionApy = borrowApy.sub(rewardsApy || 0);
    const positionUSDValue = convertMonetaryAmountToValueInUSD(
      position.amount,
      getTokenPrice(prices, position.currency.ticker)?.usd
    );

    return positionUSDValue ? total.add(positionApy.mul(positionUSDValue)) : total;
  }, new Big(0));

  return totalLendApy.sub(totalBorrowApy).div(supplyAmountUSD);
};

const getAccountPositionsStats = (
  assets: TickerToData<LoanAsset>,
  lendPositions: LendPosition[],
  borrowPositions: BorrowPosition[],
  subsidyRewards: MonetaryAmount<CurrencyExt>,
  prices: Prices,
  lendingStats: LendingStats
): AccountLendingStatistics => {
  const { totalLentBtc, totalBorrowedBtc, totalCollateralBtc } = lendingStats;
  // Convert from BTC to USD values.
  const supplyAmountUSD = convertMonetaryBtcToUSD(totalLentBtc, prices);
  const borrowAmountUSD = convertMonetaryBtcToUSD(totalBorrowedBtc, prices);
  const collateralizedAmountUSD = convertMonetaryBtcToUSD(totalCollateralBtc, prices);
  const netAPY = getNetAPY(lendPositions, borrowPositions, assets, supplyAmountUSD, prices);

  return {
    ...lendingStats,
    supplyAmountUSD,
    borrowAmountUSD,
    earnedInterestAmountUSD: new Big(0),
    collateralizedAmountUSD,
    netAmountUSD: new Big(0),
    netAPY
  };
};

const useGetAccountLendingStatistics = (): {
  data: {
    statistics: AccountLendingStatistics | undefined;
  };
  refetch: () => void;
} => {
  const {
    data: { lendPositions, borrowPositions },
    refetch: positionsRefetch
  } = useGetAccountPositions();
  const { data: loanAssets, refetch: loanAssetsRefetch } = useGetLoanAssets();

  const prices = useGetPrices();

  const { data: subsidyRewards, refetch: subsidyRewardsRefetch } = useGetAccountSubsidyRewards();

  const lendingStats = useMemo(() => {
    if (!lendPositions || !borrowPositions || !loanAssets) {
      return undefined;
    }
    return window.bridge.loans.getLendingStats(lendPositions, borrowPositions, loanAssets);
  }, [lendPositions, borrowPositions, loanAssets]);

  const statistics = useMemo(() => {
    if (!loanAssets || !lendPositions || !borrowPositions || !subsidyRewards || !prices || !lendingStats) {
      return undefined;
    }

    return getAccountPositionsStats(loanAssets, lendPositions, borrowPositions, subsidyRewards, prices, lendingStats);
  }, [lendPositions, borrowPositions, prices, subsidyRewards, loanAssets, lendingStats]);

  return {
    data: {
      statistics
    },
    refetch: () => {
      positionsRefetch();
      loanAssetsRefetch();
      subsidyRewardsRefetch();
    }
  };
};

export { useGetAccountLendingStatistics };

export type { AccountLendingStatistics };
