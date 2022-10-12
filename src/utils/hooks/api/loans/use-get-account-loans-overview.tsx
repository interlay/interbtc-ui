import {
  BorrowPosition,
  CurrencyExt,
  CurrencyIdLiteral,
  LendPosition,
  newAccountId,
  newMonetaryAmount
} from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { useSubstrateSecureState } from '@/lib/substrate';
import { getTokenPrice } from '@/utils/helpers/prices';

import { useGetPrices } from '../use-get-prices';
import { getTotalEarnedInterestUSDValue, getTotalUSDValueOfPositions } from './get-usd-values';
import { useGetAccountPositions } from './use-get-account-positions';

interface AccountLoansOverview {
  lendPositions: LendPosition[] | undefined;
  borrowPositions: BorrowPosition[] | undefined;
  lentAssetsUSDValue: Big | undefined;
  totalEarnedInterestUSDValue: Big | undefined;
  borrowedAssetsUSDValue: Big | undefined;
  collateralRatio: Big | undefined;
  getNewCollateralRatio: (
    type: 'borrow' | 'supply',
    currency: CurrencyExt,
    amount: MonetaryAmount<CurrencyExt>
  ) => Big | undefined;
  getMaxBorrowableAmount: (currency: CurrencyExt) => MonetaryAmount<CurrencyExt> | undefined;
}

const useGetAccountLoansOverview = (): AccountLoansOverview => {
  const { selectedAccount } = useSubstrateSecureState();

  const accountId = selectedAccount && newAccountId(window.bridge.api, selectedAccount.address);
  const prices = useGetPrices();
  const { lendPositions, borrowPositions } = useGetAccountPositions(accountId);

  let lentAssetsUSDValue: Big | undefined = undefined;
  let totalEarnedInterestUSDValue: Big | undefined = undefined;
  let borrowedAssetsUSDValue: Big | undefined = undefined;
  let collateralAssetsUSDValue: Big | undefined = undefined;
  let collateralRatio: Big | undefined = undefined;

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
    collateralRatio = collateralAssetsUSDValue.gt(0) ? borrowedAssetsUSDValue.div(collateralAssetsUSDValue) : Big(0);
  }

  /**
   * This method computes how the collateral ratio will change if
   * asset is borrowed or supplied.
   * @param type Type of transaction that will be done: 'supply' or 'borrow'.
   * @param currency Currency which will be supplied or borrowed.
   * @param amount Amount of `currency` that will be used.
   * @note Call only after the prices and positions are loaded.
   * @returns New collateral ratio after the supplying or borrowing is done.
   */
  const getNewCollateralRatio = useCallback(
    (type: 'borrow' | 'supply', currency: CurrencyExt, amount: MonetaryAmount<CurrencyExt>): Big | undefined => {
      if (prices === undefined || borrowedAssetsUSDValue === undefined || collateralAssetsUSDValue === undefined) {
        return undefined;
      }

      // TODO: Remove type casting after useGetPrices hook is refactored.
      const currencyPrice = getTokenPrice(prices, currency.ticker as CurrencyIdLiteral)?.usd;
      const amountUSDValue = Big(convertMonetaryAmountToValueInUSD(amount, currencyPrice) || 0);

      const newBorrowedAssetsUSDValue =
        type === 'borrow' ? borrowedAssetsUSDValue.add(amountUSDValue) : borrowedAssetsUSDValue;

      const newCollateralAssetsUSDValue =
        type === 'supply' ? collateralAssetsUSDValue.add(amountUSDValue) : collateralAssetsUSDValue;

      return newCollateralAssetsUSDValue.gt(0) ? newCollateralAssetsUSDValue.div(newBorrowedAssetsUSDValue) : Big(0);
    },
    [prices, borrowedAssetsUSDValue, collateralAssetsUSDValue]
  );

  /**
   * Get maximum amount of currency that user can borrow with currently provided collateral.
   * @param currency Currency
   * @returns maximum amount of currency that user can borrow with currently provided collateral.
   * @returns undefined if prices and assets are not loaded yet
   */
  const getMaxBorrowableAmount = useCallback(
    (currency: CurrencyExt): MonetaryAmount<CurrencyExt> | undefined => {
      if (collateralAssetsUSDValue === undefined || borrowedAssetsUSDValue === undefined || prices === undefined) {
        return undefined;
      }

      // TODO: Remove type casting after useGetPrices hook is refactored.
      const currencyUSDPrice = getTokenPrice(prices, currency.ticker as CurrencyIdLiteral)?.usd;
      const availableCollateralUSDValue = collateralAssetsUSDValue.sub(borrowedAssetsUSDValue);
      const maxBorrowableCurrencyAmount = availableCollateralUSDValue.div(currencyUSDPrice || 0);

      return newMonetaryAmount(maxBorrowableCurrencyAmount, currency);
    },
    [collateralAssetsUSDValue, borrowedAssetsUSDValue, prices]
  );

  return {
    lendPositions,
    borrowPositions,
    lentAssetsUSDValue,
    totalEarnedInterestUSDValue,
    borrowedAssetsUSDValue,
    collateralRatio,
    getNewCollateralRatio,
    getMaxBorrowableAmount
  };
};

export { useGetAccountLoansOverview };
