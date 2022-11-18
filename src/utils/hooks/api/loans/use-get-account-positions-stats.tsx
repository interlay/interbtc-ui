import { BorrowPosition, CurrencyExt, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { getTokenPrice } from '@/utils/helpers/prices';

import useAccountId from '../../use-account-id';
import { Prices, useGetPrices } from '../use-get-prices';
import { useGetAccountPositions } from './use-get-account-positions';
import { useGetLoanAssets } from './use-get-loan-assets';
import { getPositionsSumOfFieldsInUSD, getTotalEarnedRewards } from './utils';

interface AccountPositionsStatsData {
  earnedRewards: MonetaryAmount<CurrencyExt> | undefined;
  supplyAmountUSD: Big | undefined;
  borrowAmountUSD: Big | undefined;
  collateralAmountUSD: Big | undefined;
  earnedInterestAmountUSD: Big | undefined;
  earnedDeptAmountUSD: Big | undefined;
  netYieldAmountUSD: Big | undefined;
}

const getAccountPositionsStats = (
  assets: TickerToData<LoanAsset>,
  lendPositions: LendPosition[],
  borrowPositions: BorrowPosition[],
  prices: Prices
): AccountPositionsStatsData => {
  // let lentAssetsUSDValue: Big | undefined = undefined;
  // let totalEarnedInterestUSDValue: Big | undefined = undefined;
  // let borrowedAssetsUSDValue: Big | undefined = undefined;
  // let collateralAssetsUSDValue: Big | undefined = undefined;
  // let totalAccruedUSDValue: Big | undefined = undefined;
  // let netYieldUSDValue: Big | undefined = undefined;

  // let earnedRewards: MonetaryAmount<CurrencyExt> | undefined = undefined;

  // if (lendPositions !== undefined && prices !== undefined && assets !== undefined) {
  //   lentAssetsUSDValue = getPositionsSumOfFieldsInUSD('amount', lendPositions, prices);
  //   totalEarnedInterestUSDValue = getPositionsSumOfFieldsInUSD<LendPosition>('earnedInterest', lendPositions, prices);

  //   const collateralLendPositions = lendPositions
  //     .filter(({ isCollateral }) => isCollateral)
  //     .map(({ amount, currency, ...rest }) => ({
  //       // MEMO: compute total value based on collateral threshold (not full lend amount value)
  //       amount: amount.mul(assets[currency.ticker].collateralThreshold),
  //       currency,
  //       ...rest
  //     }));

  //   collateralAssetsUSDValue = getPositionsSumOfFieldsInUSD('amount', collateralLendPositions, prices);
  // }

  // if (borrowPositions !== undefined && prices !== undefined) {
  //   borrowedAssetsUSDValue = getPositionsSumOfFieldsInUSD('amount', borrowPositions, prices);
  // }

  // if (borrowPositions !== undefined && prices !== undefined) {
  //   totalAccruedUSDValue = getPositionsSumOfFieldsInUSD('accumulatedDebt', borrowPositions, prices);
  // }

  // if (lendPositions !== undefined && borrowPositions !== undefined) {
  //   earnedRewards = getTotalEarnedRewards(lendPositions, borrowPositions);
  // }

  // if (totalEarnedInterestUSDValue !== undefined && earnedRewards !== undefined && totalAccruedUSDValue !== undefined) {
  //   const totalEarnedRewardsUSDValue =
  //     convertMonetaryAmountToValueInUSD(earnedRewards, getTokenPrice(prices, earnedRewards.currency.ticker)?.usd) || 0;
  //   netYieldUSDValue = totalEarnedInterestUSDValue.add(totalEarnedRewardsUSDValue).sub(totalAccruedUSDValue);
  // }

  const supplyAmountUSD = getPositionsSumOfFieldsInUSD('amount', lendPositions, prices);

  const borrowAmountUSD = getPositionsSumOfFieldsInUSD('amount', borrowPositions, prices);

  const earnedRewards = getTotalEarnedRewards(lendPositions, borrowPositions);

  const earnedInterestAmountUSD = getPositionsSumOfFieldsInUSD<LendPosition>('earnedInterest', lendPositions, prices);

  const collateralLendPositions = lendPositions
    .filter(({ isCollateral }) => isCollateral)
    .map(({ amount, currency, ...rest }) => ({
      // MEMO: compute total value based on collateral threshold (not full lend amount value)
      amount: amount.mul(assets[currency.ticker].collateralThreshold),
      currency,
      ...rest
    }));

  const collateralAmountUSD = getPositionsSumOfFieldsInUSD('amount', collateralLendPositions, prices);

  const earnedDeptAmountUSD = getPositionsSumOfFieldsInUSD('accumulatedDebt', borrowPositions, prices);

  const totalEarnedRewardsUSDValue =
    convertMonetaryAmountToValueInUSD(earnedRewards, getTokenPrice(prices, earnedRewards.currency.ticker)?.usd) || 0;
  netYieldUSDValue = totalEarnedInterestUSDValue.add(totalEarnedRewardsUSDValue).sub(totalAccruedUSDValue);

  return {
    supplyAmountUSD,
    borrowAmountUSD,
    earnedInterestAmountUSD,
    collateralAmountUSD,
    earnedDeptAmountUSD,
    netYieldAmountUSD,
    earnedRewards
  };
};

export { useGetAccountLoansOverview };
