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
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { convertMonetaryAmountToValueInUSD, convertMonetaryBtcToUSD } from '@/common/utils/utils';
import { getSubsidyRewardApy } from '@/pages/Loans/LoansOverview/utils/get-subsidy-rewards-apy';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetLoanAssets } from '@/utils/hooks/api/loans/use-get-loan-assets';
import useAccountId from '@/utils/hooks/use-account-id';

import { Prices, useGetPrices } from '../use-get-prices';
import { useGetAccountSubsidyRewards } from './use-get-account-subsidy-rewards';

const useGetLendPositionsOfAccount = (): {
  data: Array<LendPosition> | undefined;
  refetch: () => void;
} => {
  const accountId = useAccountId();

  const { data, error, refetch } = useQuery({
    queryKey: ['getLendPositionsOfAccount', accountId],
    queryFn: async () => {
      if (!accountId) {
        throw new Error('Something went wrong!');
      }

      return await window.bridge.loans.getLendPositionsOfAccount(accountId);
    },
    enabled: !!accountId,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  return { data, refetch };
};

const useGetBorrowPositionsOfAccount = (): {
  data: Array<BorrowPosition> | undefined;
  refetch: () => void;
} => {
  const accountId = useAccountId();

  const { data, error, refetch } = useQuery({
    queryKey: ['getBorrowPositionsOfAccount', accountId],
    queryFn: async () => {
      if (!accountId) {
        throw new Error('Something went wrong!');
      }

      return await window.bridge.loans.getBorrowPositionsOfAccount(accountId);
    },
    enabled: !!accountId,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  return { data, refetch };
};

interface AccountPositionsStatisticsData extends LendingStats {
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
): AccountPositionsStatisticsData => {
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

const useLoanInfo = (): {
  data: {
    statistics: AccountPositionsStatisticsData | undefined;
  };
  refetch: () => void;
} => {
  const { data: lendPositions, refetch: lendPositionsRefetch } = useGetLendPositionsOfAccount();

  const { data: borrowPositions, refetch: borrowPositionsRefetch } = useGetBorrowPositionsOfAccount();

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
      lendPositionsRefetch();
      borrowPositionsRefetch();
      loanAssetsRefetch();
      subsidyRewardsRefetch();
    }
  };
};

export { useGetBorrowPositionsOfAccount, useGetLendPositionsOfAccount, useLoanInfo };

export type { AccountPositionsStatisticsData };
