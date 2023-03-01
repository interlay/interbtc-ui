import { BorrowPosition, CurrencyExt, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useMemo } from 'react';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { getSubsidyRewardApy } from '@/pages/Loans/LoansOverview/utils/get-subsidy-rewards-apy';
import { getTokenPrice } from '@/utils/helpers/prices';
import {
  useGetBorrowPositionsOfAccount,
  useGetLendPositionsOfAccount
} from '@/utils/hooks/api/loans/lend-and-borrow-info';

import { Prices, useGetPrices } from '../use-get-prices';
import { useGetAccountSubsidyRewards } from './use-get-account-subsidy-rewards';
import { useGetLoanAssets } from './use-get-loan-assets';
import { getPositionsSumOfFieldsInUSD } from './utils';

interface AccountPositionsData {
  lendPositions: LendPosition[];
  borrowPositions: BorrowPosition[];
}

interface PositionsThresholdsData {
  collateral: Big;
  liquidation: Big;
}

interface AccountPositionsStatisticsData {
  supplyAmountUSD: Big;
  borrowAmountUSD: Big;
  collateralAmountUSD: Big;
  liquidationAmountUSD: Big;
  collateralizedAmountUSD: Big;
  earnedInterestAmountUSD: Big;
  earnedDeptAmountUSD: Big;
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
  prices: Prices
): AccountPositionsStatisticsData => {
  const supplyAmountUSD = getPositionsSumOfFieldsInUSD('amount', lendPositions, prices);

  const borrowAmountUSD = getPositionsSumOfFieldsInUSD('amount', borrowPositions, prices);

  const collateralLendPositions = lendPositions.filter(({ isCollateral }) => isCollateral);

  const collateralPositionsWithAppliedCollateralThreshold = collateralLendPositions.map(
    ({ amount, currency, ...rest }) => ({
      // MEMO: compute total value based on collateral threshold (not full lend amount value)
      amount: amount.mul(assets[currency.ticker].collateralThreshold),
      currency,
      ...rest
    })
  );

  const collateralPositionsWithAppliedLiquidationThreshold = collateralLendPositions.map(
    ({ amount, currency, ...rest }) => ({
      // MEMO: compute total value based on collateral threshold (not full lend amount value)
      amount: amount.mul(assets[currency.ticker].liquidationThreshold),
      currency,
      ...rest
    })
  );

  const collateralAmountUSD = getPositionsSumOfFieldsInUSD(
    'amount',
    collateralPositionsWithAppliedCollateralThreshold,
    prices
  );
  const liquidationAmountUSD = getPositionsSumOfFieldsInUSD(
    'amount',
    collateralPositionsWithAppliedLiquidationThreshold,
    prices
  );

  const collateralizedAmountUSD = getPositionsSumOfFieldsInUSD('amount', collateralLendPositions, prices);
  const earnedDeptAmountUSD = getPositionsSumOfFieldsInUSD('accumulatedDebt', borrowPositions, prices);

  // TODO: This is temporary, atleast until earned interest
  // is moved into squid.
  // const totalEarnedRewardsUSDValue =
  //   convertMonetaryAmountToValueInUSD(subsidyRewards, getTokenPrice(prices, subsidyRewards.currency.ticker)?.usd) || 0;
  // const netAmountUSD = earnedInterestAmountUSD.add(totalEarnedRewardsUSDValue).sub(earnedDeptAmountUSD);

  const netAPY = getNetAPY(lendPositions, borrowPositions, assets, supplyAmountUSD, prices);

  return {
    supplyAmountUSD,
    borrowAmountUSD,
    earnedInterestAmountUSD: new Big(0),
    collateralAmountUSD,
    liquidationAmountUSD,
    collateralizedAmountUSD,
    earnedDeptAmountUSD,
    netAmountUSD: new Big(0),
    netAPY
  };
};

type UseGetAccountPositions = {
  data: Partial<AccountPositionsData> & {
    statistics: AccountPositionsStatisticsData | undefined;
    hasCollateral: boolean;
  };
  refetch: () => void;
};

const useGetAccountPositions = (): UseGetAccountPositions => {
  // ray test touch <
  const prices = useGetPrices();
  // ray test touch >
  const { data: assets } = useGetLoanAssets();

  const { data: lendPositions, refetch: lendPositionsRefetch } = useGetLendPositionsOfAccount();

  const { data: borrowPositions, refetch: borrowPositionsRefetch } = useGetBorrowPositionsOfAccount();

  const { data: subsidyRewards } = useGetAccountSubsidyRewards();

  // MEMO: we dont need assets as a dependency, since we only use the collateral threshold and
  // it's value is very unlikely to change
  const statistics = useMemo(() => {
    if (!assets || !lendPositions || !borrowPositions || !subsidyRewards || !prices) {
      return undefined;
    }

    return getAccountPositionsStats(assets, lendPositions, borrowPositions, subsidyRewards, prices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lendPositions, borrowPositions, prices, subsidyRewards]);

  return {
    data: {
      borrowPositions: borrowPositions,
      lendPositions: lendPositions,
      hasCollateral: !!lendPositions?.find((position) => position.isCollateral),
      statistics
    },
    refetch: () => {
      lendPositionsRefetch();
      borrowPositionsRefetch();
    }
  };
};

export { useGetAccountPositions };
export type { AccountPositionsData, AccountPositionsStatisticsData, PositionsThresholdsData };
