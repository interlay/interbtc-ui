import { BorrowPosition, CurrencyExt, LendPosition, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { getTokenPrice } from '@/utils/helpers/prices';

import useAccountId from '../../use-account-id';
import { useGetPrices } from '../use-get-prices';
import { useGetAccountPositions } from './use-get-account-positions';
import { useGetAccountSubsidyRewards } from './use-get-account-subsidy-rewards';
import { useGetLoanAssets } from './use-get-loan-assets';
import { getPositionsSumOfFieldsInUSD } from './utils';

interface AccountLoansOverviewData {
  lendPositions: LendPosition[] | undefined;
  borrowPositions: BorrowPosition[] | undefined;
  lentAssetsUSDValue: Big | undefined;
  totalEarnedInterestUSDValue: Big | undefined;
  borrowedAssetsUSDValue: Big | undefined;
  subsidyRewards: MonetaryAmount<CurrencyExt> | undefined;
  netYieldUSDValue: Big | undefined;
  collateralAssetsUSDValue: Big | undefined;
}

interface AccountLoansOverview {
  data: AccountLoansOverviewData;
  refetch: () => void;
  getMaxBorrowableAmount: (
    currency: CurrencyExt,
    availableCapacity: MonetaryAmount<CurrencyExt>
  ) => MonetaryAmount<CurrencyExt> | undefined;
  getMaxWithdrawableAmount: (currency: CurrencyExt, position: LendPosition) => MonetaryAmount<CurrencyExt> | undefined;
}

const useGetAccountLoansOverview = (): AccountLoansOverview => {
  const accountId = useAccountId();
  const { data: assets, refetch: refetchLoanAssets } = useGetLoanAssets();

  const prices = useGetPrices();

  const {
    data: { lendPositions, borrowPositions },
    refetch: refetchPositions
  } = useGetAccountPositions(accountId);

  const { data: subsidyRewards, refetch: refetchSubsidyRewards } = useGetAccountSubsidyRewards(accountId);

  let lentAssetsUSDValue: Big | undefined = undefined;
  let totalEarnedInterestUSDValue: Big | undefined = undefined;
  let borrowedAssetsUSDValue: Big | undefined = undefined;
  let collateralAssetsUSDValue: Big | undefined = undefined;
  let totalAccruedUSDValue: Big | undefined = undefined;
  let netYieldUSDValue: Big | undefined = undefined;

  if (lendPositions !== undefined && prices !== undefined && assets !== undefined) {
    lentAssetsUSDValue = getPositionsSumOfFieldsInUSD('amount', lendPositions, prices);
    totalEarnedInterestUSDValue = getPositionsSumOfFieldsInUSD<LendPosition>('earnedInterest', lendPositions, prices);

    const collateralLendPositions = lendPositions
      .filter(({ isCollateral }) => isCollateral)
      .map(({ amount, currency, ...rest }) => ({
        // MEMO: compute total value based on collateral threshold (not full lend amount value)
        amount: amount.mul(assets[currency.ticker].collateralThreshold),
        currency,
        ...rest
      }));

    collateralAssetsUSDValue = getPositionsSumOfFieldsInUSD('amount', collateralLendPositions, prices);
  }

  if (borrowPositions !== undefined && prices !== undefined) {
    borrowedAssetsUSDValue = getPositionsSumOfFieldsInUSD('amount', borrowPositions, prices);
  }

  if (borrowPositions !== undefined && prices !== undefined) {
    totalAccruedUSDValue = getPositionsSumOfFieldsInUSD('accumulatedDebt', borrowPositions, prices);
  }

  if (totalEarnedInterestUSDValue !== undefined && subsidyRewards !== undefined && totalAccruedUSDValue !== undefined) {
    const totalSubsidyRewardsUSDValue =
      convertMonetaryAmountToValueInUSD(subsidyRewards, getTokenPrice(prices, subsidyRewards.currency.ticker)?.usd) ||
      0;
    netYieldUSDValue = totalEarnedInterestUSDValue.add(totalSubsidyRewardsUSDValue).sub(totalAccruedUSDValue);
  }

  /**
   * Get maximum amount of currency that user can borrow with currently provided collateral and liquidity.
   * @param currency Currency of which max borrowable amount to get.
   * @param availableCapacity Total capacity that can be borrowed from the protocol.
   * @returns maximum amount of currency that user can borrow with currently provided collateral.
   * @returns undefined if prices and assets are not loaded yet
   */
  const getMaxBorrowableAmount = useCallback(
    (
      currency: CurrencyExt,
      availableCapacity: MonetaryAmount<CurrencyExt>
    ): MonetaryAmount<CurrencyExt> | undefined => {
      if (collateralAssetsUSDValue === undefined || borrowedAssetsUSDValue === undefined || prices === undefined) {
        return undefined;
      }

      const currencyUSDPrice = getTokenPrice(prices, currency.ticker)?.usd;

      if (currencyUSDPrice === undefined) {
        return undefined;
      }

      const availableCollateralUSDValue = collateralAssetsUSDValue.sub(borrowedAssetsUSDValue);
      const maxBorrowableCurrencyAmount = availableCollateralUSDValue.div(currencyUSDPrice);

      const maxBorrowableAmountByCollateral =
        new MonetaryAmount(currency, maxBorrowableCurrencyAmount) || new MonetaryAmount(currency, 0);
      return availableCapacity.gt(maxBorrowableAmountByCollateral)
        ? maxBorrowableAmountByCollateral
        : availableCapacity;
    },
    [collateralAssetsUSDValue, borrowedAssetsUSDValue, prices]
  );

  /**
   * Get maximum amount of currency that user can withdraw with currently provided collateral and liquidity.
   * @param currency Currency of which max borrowable amount to get.
   * @returns maximum amount of currency that user can withdraw with currently provided collateral.
   * @returns undefined if prices and assets are not loaded yet
   */

  const getMaxWithdrawableAmount = useCallback(
    (currency: CurrencyExt, position: LendPosition): MonetaryAmount<CurrencyExt> | undefined => {
      if (
        collateralAssetsUSDValue === undefined ||
        borrowedAssetsUSDValue === undefined ||
        prices === undefined ||
        assets === undefined
      ) {
        return undefined;
      }

      const currencyUSDPrice = getTokenPrice(prices, currency.ticker)?.usd;

      if (currencyUSDPrice === undefined) {
        return undefined;
      }

      const positionInUSD = position.amount.toBig().mul(currencyUSDPrice);

      if (!position.isCollateral || positionInUSD.lt(collateralAssetsUSDValue.sub(borrowedAssetsUSDValue))) {
        return position.amount;
      }

      const collateralThreshold = assets[currency.ticker].collateralThreshold;
      const minCollateralNeeded = borrowedAssetsUSDValue.div(collateralThreshold);

      const maxWithdrawable = positionInUSD.sub(minCollateralNeeded).div(currencyUSDPrice);

      return newMonetaryAmount(maxWithdrawable, currency, true);
    },
    [borrowedAssetsUSDValue, prices, assets, collateralAssetsUSDValue]
  );

  const refetch = () => {
    refetchPositions();
    refetchLoanAssets();
    refetchSubsidyRewards();
  };

  return {
    data: {
      lendPositions,
      borrowPositions,
      lentAssetsUSDValue,
      totalEarnedInterestUSDValue,
      borrowedAssetsUSDValue,
      subsidyRewards,
      netYieldUSDValue,
      collateralAssetsUSDValue
    },
    refetch,
    getMaxBorrowableAmount,
    getMaxWithdrawableAmount
  };
};

export { useGetAccountLoansOverview };
