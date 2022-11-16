import { BorrowPosition, CurrencyExt, LendPosition, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { BorrowAction, LendAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';

import useAccountId from '../../use-account-id';
import { useGetPrices } from '../use-get-prices';
import { useGetAccountPositions } from './use-get-account-positions';
import { useGetLoanAssets } from './use-get-loan-assets';
import { getPositionsSumOfFieldsInUSD, getTotalEarnedRewards } from './utils';

interface AccountLoansOverviewData {
  lendPositions: LendPosition[] | undefined;
  borrowPositions: BorrowPosition[] | undefined;
  lentAssetsUSDValue: Big | undefined;
  totalEarnedInterestUSDValue: Big | undefined;
  borrowedAssetsUSDValue: Big | undefined;
  borrowLimitUSDValue: Big | undefined;
  collateralRatio: number | undefined;
  earnedRewards: MonetaryAmount<CurrencyExt> | undefined;
  netYieldUSDValue: Big | undefined;
  collateralAssetsUSDValue: Big | undefined;
}

interface AccountLoansOverview {
  data: AccountLoansOverviewData;
  refetch: () => void;
  getNewCollateralRatio: (
    type: LendAction | BorrowAction,
    currency: CurrencyExt,
    amount: MonetaryAmount<CurrencyExt>
  ) => number | undefined;
  getNewBorrowLimitUSDValue: (
    type: LendAction | BorrowAction,
    currency: CurrencyExt,
    amount: MonetaryAmount<CurrencyExt>
  ) => Big | undefined;
  getMaxBorrowableAmount: (
    currency: CurrencyExt,
    availableCapacity: MonetaryAmount<CurrencyExt>
  ) => MonetaryAmount<CurrencyExt> | undefined;
  getMaxWithdrawableAmount: (currency: CurrencyExt, position: LendPosition) => MonetaryAmount<CurrencyExt> | undefined;
}

const useGetAccountLoansOverview = (): AccountLoansOverview => {
  const accountId = useAccountId();
  const { assets } = useGetLoanAssets();

  const prices = useGetPrices();

  const {
    data: { lendPositions, borrowPositions },
    refetch
  } = useGetAccountPositions(accountId);

  let lentAssetsUSDValue: Big | undefined = undefined;
  let totalEarnedInterestUSDValue: Big | undefined = undefined;
  let borrowedAssetsUSDValue: Big | undefined = undefined;
  let collateralAssetsUSDValue: Big | undefined = undefined;
  let totalAccruedUSDValue: Big | undefined = undefined;
  let netYieldUSDValue: Big | undefined = undefined;
  let collateralRatio: number | undefined = undefined;
  let earnedRewards: MonetaryAmount<CurrencyExt> | undefined = undefined;

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

  if (borrowedAssetsUSDValue !== undefined && collateralAssetsUSDValue !== undefined) {
    collateralRatio = borrowedAssetsUSDValue.gt(0)
      ? collateralAssetsUSDValue.div(borrowedAssetsUSDValue).toNumber()
      : Infinity;
  }

  if (borrowPositions !== undefined && prices !== undefined) {
    totalAccruedUSDValue = getPositionsSumOfFieldsInUSD('accumulatedDebt', borrowPositions, prices);
  }

  if (lendPositions !== undefined && borrowPositions !== undefined) {
    earnedRewards = getTotalEarnedRewards(lendPositions, borrowPositions);
  }

  if (totalEarnedInterestUSDValue !== undefined && earnedRewards !== undefined && totalAccruedUSDValue !== undefined) {
    const totalEarnedRewardsUSDValue =
      convertMonetaryAmountToValueInUSD(earnedRewards, getTokenPrice(prices, earnedRewards.currency.ticker)?.usd) || 0;
    netYieldUSDValue = totalEarnedInterestUSDValue.add(totalEarnedRewardsUSDValue).sub(totalAccruedUSDValue);
  }

  const borrowLimitUSDValue = collateralAssetsUSDValue
    ? collateralAssetsUSDValue.sub(borrowedAssetsUSDValue || 0)
    : Big(0);

  /**
   * This method computes how the collateral ratio will change if
   * asset is withdrawn or deposited.
   * @param type Type of transaction that will be done.
   * @param currency Currency which will be deposited or withdrawn.
   * @param amount Amount of `currency` that will be used.
   * @note Call only after the prices and positions are loaded.
   * @returns New collateral ratio after the transaction is done.
   */
  const getNewCollateralRatio = useCallback(
    (
      type: LendAction | BorrowAction,
      currency: CurrencyExt,
      amount: MonetaryAmount<CurrencyExt>
    ): number | undefined => {
      if (
        prices === undefined ||
        borrowedAssetsUSDValue === undefined ||
        collateralAssetsUSDValue === undefined ||
        assets === undefined
      ) {
        return undefined;
      }

      const currencyPrice = getTokenPrice(prices, currency.ticker)?.usd;
      const amountUSDValue = Big(convertMonetaryAmountToValueInUSD(amount, currencyPrice) || 0);

      const newBorrowedAssetsUSDValue =
        type === 'borrow'
          ? borrowedAssetsUSDValue.add(amountUSDValue)
          : type === 'repay'
          ? borrowedAssetsUSDValue.sub(amountUSDValue)
          : borrowedAssetsUSDValue;

      const baseAmountUSDValue = amountUSDValue.mul(assets[currency.ticker].collateralThreshold);

      const newCollateralAssetsUSDValue =
        type === 'lend'
          ? collateralAssetsUSDValue.add(baseAmountUSDValue)
          : type === 'withdraw'
          ? collateralAssetsUSDValue.sub(baseAmountUSDValue)
          : collateralAssetsUSDValue;

      return newBorrowedAssetsUSDValue.gt(0)
        ? newCollateralAssetsUSDValue.div(newBorrowedAssetsUSDValue).toNumber()
        : Infinity;
    },
    [prices, borrowedAssetsUSDValue, collateralAssetsUSDValue, assets]
  );

  /**
   * This method computes how the borrow limit will change if
   * asset is withdrawn or deposited to protocol.
   * @param type Type of transaction to be done.
   * @param currency Currency which will be deposited or withdrawn.
   * @param amount Amount of `currency` that will be used.
   * @note Call only after the prices and positions are loaded.
   * @returns New borrow limit in USD after the transaction is done.
   */
  const getNewBorrowLimitUSDValue = useCallback(
    (type: LendAction | BorrowAction, currency: CurrencyExt, amount: MonetaryAmount<CurrencyExt>): Big | undefined => {
      if (
        prices === undefined ||
        borrowedAssetsUSDValue === undefined ||
        collateralAssetsUSDValue === undefined ||
        assets === undefined
      ) {
        return undefined;
      }

      const currencyPrice = getTokenPrice(prices, currency.ticker)?.usd;
      const amountUSDValue = Big(convertMonetaryAmountToValueInUSD(amount, currencyPrice) || 0);

      const newBorrowedAssetsUSDValue =
        type === 'borrow'
          ? borrowedAssetsUSDValue.add(amountUSDValue)
          : type === 'repay'
          ? borrowedAssetsUSDValue.sub(amountUSDValue)
          : borrowedAssetsUSDValue;

      const baseAmountUSDValue = amountUSDValue.mul(assets[currency.ticker].collateralThreshold);

      const newCollateralAssetsUSDValue =
        type === 'lend'
          ? collateralAssetsUSDValue.add(baseAmountUSDValue)
          : type === 'withdraw'
          ? collateralAssetsUSDValue.sub(baseAmountUSDValue)
          : collateralAssetsUSDValue;

      return newCollateralAssetsUSDValue.sub(newBorrowedAssetsUSDValue);
    },
    [prices, borrowedAssetsUSDValue, collateralAssetsUSDValue, assets]
  );

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

  return {
    data: {
      lendPositions,
      borrowPositions,
      lentAssetsUSDValue,
      totalEarnedInterestUSDValue,
      borrowedAssetsUSDValue,
      borrowLimitUSDValue,
      collateralRatio,
      earnedRewards,
      netYieldUSDValue,
      collateralAssetsUSDValue
    },
    refetch,
    getNewCollateralRatio,
    getNewBorrowLimitUSDValue,
    getMaxBorrowableAmount,
    getMaxWithdrawableAmount
  };
};

export { useGetAccountLoansOverview };
