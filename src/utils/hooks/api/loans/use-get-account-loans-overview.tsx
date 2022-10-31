import { BorrowPosition, CurrencyExt, CurrencyIdLiteral, LendPosition } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { BorrowAction, LendAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';

import useAccountId from '../../use-account-id';
import { useGetPrices } from '../use-get-prices';
import { getTotalEarnedInterestUSDValue, getTotalUSDValueOfPositions } from './get-usd-values';
import { useGetAccountPositions } from './use-get-account-positions';

interface AccountLoansOverviewData {
  lendPositions: LendPosition[] | undefined;
  borrowPositions: BorrowPosition[] | undefined;
  lentAssetsUSDValue: Big | undefined;
  totalEarnedInterestUSDValue: Big | undefined;
  borrowedAssetsUSDValue: Big | undefined;
  borrowLimitUSDValue: Big | undefined;
  collateralRatio: number | undefined;
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
}

const useGetAccountLoansOverview = (): AccountLoansOverview => {
  const accountId = useAccountId();

  const prices = useGetPrices();

  const {
    data: { lendPositions, borrowPositions },
    refetch
  } = useGetAccountPositions(accountId);

  let lentAssetsUSDValue: Big | undefined = undefined;
  let totalEarnedInterestUSDValue: Big | undefined = undefined;
  let borrowedAssetsUSDValue: Big | undefined = undefined;
  let collateralAssetsUSDValue: Big | undefined = undefined;
  let collateralRatio: number | undefined = undefined;

  if (lendPositions !== undefined && prices !== undefined) {
    lentAssetsUSDValue = getTotalUSDValueOfPositions(lendPositions, prices);
    totalEarnedInterestUSDValue = getTotalEarnedInterestUSDValue(lendPositions, prices);

    const collateralLendPositions = lendPositions.filter(({ isCollateral }) => isCollateral);
    collateralAssetsUSDValue = getTotalUSDValueOfPositions(collateralLendPositions, prices);
  }

  if (borrowPositions !== undefined && prices !== undefined) {
    borrowedAssetsUSDValue = getTotalUSDValueOfPositions(borrowPositions, prices);
  }

  if (borrowedAssetsUSDValue !== undefined && collateralAssetsUSDValue !== undefined) {
    collateralRatio = borrowedAssetsUSDValue.gt(0)
      ? collateralAssetsUSDValue.div(borrowedAssetsUSDValue).toNumber()
      : Infinity;
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
      if (prices === undefined || borrowedAssetsUSDValue === undefined || collateralAssetsUSDValue === undefined) {
        return undefined;
      }

      // TODO: Remove type casting after useGetPrices hook is refactored.
      const currencyPrice = getTokenPrice(prices, currency.ticker as CurrencyIdLiteral)?.usd;
      const amountUSDValue = Big(convertMonetaryAmountToValueInUSD(amount, currencyPrice) || 0);

      const newBorrowedAssetsUSDValue =
        type === 'withdraw' || type === 'borrow' ? borrowedAssetsUSDValue.add(amountUSDValue) : borrowedAssetsUSDValue;

      const newCollateralAssetsUSDValue =
        type === 'lend' || type === 'repay' ? collateralAssetsUSDValue.add(amountUSDValue) : collateralAssetsUSDValue;

      return newBorrowedAssetsUSDValue.gt(0)
        ? newCollateralAssetsUSDValue.div(newBorrowedAssetsUSDValue).toNumber()
        : Infinity;
    },
    [prices, borrowedAssetsUSDValue, collateralAssetsUSDValue]
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
      if (prices === undefined || borrowedAssetsUSDValue === undefined || collateralAssetsUSDValue === undefined) {
        return undefined;
      }

      // TODO: Remove type casting after useGetPrices hook is refactored.
      const currencyPrice = getTokenPrice(prices, currency.ticker as CurrencyIdLiteral)?.usd;
      const amountUSDValue = Big(convertMonetaryAmountToValueInUSD(amount, currencyPrice) || 0);

      const newBorrowedAssetsUSDValue =
        type === 'withdraw' || type === 'borrow' ? borrowedAssetsUSDValue.add(amountUSDValue) : borrowedAssetsUSDValue;

      const newCollateralAssetsUSDValue =
        type === 'lend' || type === 'repay' ? collateralAssetsUSDValue.add(amountUSDValue) : collateralAssetsUSDValue;

      return newCollateralAssetsUSDValue.sub(newBorrowedAssetsUSDValue || 0);
    },
    [prices, borrowedAssetsUSDValue, collateralAssetsUSDValue]
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

      // TODO: Remove type casting after useGetPrices hook is refactored.
      const currencyUSDPrice = getTokenPrice(prices, currency.ticker as CurrencyIdLiteral)?.usd;

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

  return {
    data: {
      lendPositions,
      borrowPositions,
      lentAssetsUSDValue,
      totalEarnedInterestUSDValue,
      borrowedAssetsUSDValue,
      borrowLimitUSDValue,
      collateralRatio
    },
    refetch,
    getNewCollateralRatio,
    getNewBorrowLimitUSDValue,
    getMaxBorrowableAmount
  };
};

export { useGetAccountLoansOverview };
