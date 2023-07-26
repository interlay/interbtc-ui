import { BorrowPosition, CollateralPosition, LendingStats, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useMemo } from 'react';

import { convertMonetaryAmountToValueInUSD, convertMonetaryBtcToUSD } from '@/common/utils/utils';
import { useGetLoanAssets } from '@/hooks/api/loans/use-get-loan-assets';
import { getSubsidyRewardApy } from '@/utils/helpers/loans';
import { getTokenPrice } from '@/utils/helpers/prices';

import { Prices, useGetPrices } from '../use-get-prices';
import { useGetAccountPositions } from './use-get-account-positions';

interface AccountLendingStatistics extends LendingStats {
  supplyAmountUSD: Big;
  borrowAmountUSD: Big;
  collateralizedAmountUSD: Big;
  earnedInterestAmountUSD: Big;
  netAmountUSD: Big;
  netAPY: Big;
}

interface UseGetAccountLendingStatistics {
  data: AccountLendingStatistics | undefined;
  refetch: () => void;
}

const getNetAPY = (
  lendPositions: CollateralPosition[],
  borrowPositions: BorrowPosition[],
  assets: TickerToData<LoanAsset>,
  supplyAmountUSD: Big,
  prices: Prices
): Big => {
  if (!supplyAmountUSD.gt(0)) {
    return new Big(0);
  }

  const totalLendApy = lendPositions.reduce((total, position) => {
    const { currency } = position.amount;
    const { lendApy, lendReward } = assets[currency.ticker];
    const rewardsApy = getSubsidyRewardApy(currency, lendReward, prices);
    const positionApy = lendApy.add(rewardsApy || 0);
    const positionUSDValue = convertMonetaryAmountToValueInUSD(
      position.amount,
      getTokenPrice(prices, currency.ticker)?.usd
    );

    return positionUSDValue ? total.add(positionApy.mul(positionUSDValue)) : total;
  }, new Big(0));

  const totalBorrowApy = borrowPositions.reduce((total, position) => {
    const { currency } = position.amount;
    const { borrowApy, borrowReward } = assets[currency.ticker];

    const rewardsApy = getSubsidyRewardApy(currency, borrowReward, prices);
    const positionApy = borrowApy.sub(rewardsApy || 0);
    const positionUSDValue = convertMonetaryAmountToValueInUSD(
      position.amount,
      getTokenPrice(prices, currency.ticker)?.usd
    );

    return positionUSDValue ? total.add(positionApy.mul(positionUSDValue)) : total;
  }, new Big(0));

  return totalLendApy.sub(totalBorrowApy).div(supplyAmountUSD);
};

const getAccountPositionsStats = (
  assets: TickerToData<LoanAsset>,
  lendPositions: CollateralPosition[],
  borrowPositions: BorrowPosition[],
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

const useGetAccountLendingStatistics = (): UseGetAccountLendingStatistics => {
  const {
    data: { lendPositions, borrowPositions },
    refetch: positionsRefetch
  } = useGetAccountPositions();
  const { data: loanAssets, refetch: loanAssetsRefetch } = useGetLoanAssets();

  const prices = useGetPrices();

  const lendingStats = useMemo(() => {
    if (!lendPositions || !borrowPositions || !loanAssets) {
      return undefined;
    }
    return window.bridge.loans.getLendingStats(lendPositions, borrowPositions, loanAssets);
  }, [lendPositions, borrowPositions, loanAssets]);

  const statistics = useMemo(() => {
    if (!loanAssets || !lendPositions || !borrowPositions || !prices || !lendingStats) {
      return undefined;
    }

    return getAccountPositionsStats(loanAssets, lendPositions, borrowPositions, prices, lendingStats);
  }, [lendPositions, borrowPositions, prices, loanAssets, lendingStats]);

  return {
    data: statistics,
    refetch: () => {
      positionsRefetch();
      loanAssetsRefetch();
    }
  };
};

export { useGetAccountLendingStatistics };

export type { AccountLendingStatistics };
