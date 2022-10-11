import { BorrowPosition, CurrencyExt, CurrencyIdLiteral, LendPosition } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { useCallback } from 'react';

import { Prices } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { getTokenPrice } from '@/utils/helpers/prices';

import { useGetPrices } from '../use-get-prices';
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
}

const getTotalEarnedInterestUSDValue = (lendPositions: LendPosition[], prices: Prices) => {
  return lendPositions.reduce((totalValue: Big, position: LendPosition) => {
    const { currency, earnedInterest } = position;
    // TODO: Remove type casting after useGetPrices hook is refactored
    const price = getTokenPrice(prices, currency.ticker as CurrencyIdLiteral)?.usd;

    if (price === undefined) {
      console.error(`useGetAccountCollateralization: No exchange rate found for currency: ${currency.name}`);
    }

    const positionUSDValue = convertMonetaryAmountToValueInUSD(earnedInterest, price);
    return totalValue.add(positionUSDValue || 0);
  }, Big(0));
};

// TODO: use LoanPosition[] type instead after it's exported from the lib
const getTotalUSDValueOfPositions = (positions: BorrowPosition[], prices: Prices) => {
  return positions.reduce((totalValue: Big, position: LendPosition | BorrowPosition) => {
    const { currency, amount } = position;
    // TODO: Remove type casting after useGetPrices hook is refactored
    const price = getTokenPrice(prices, currency.ticker as CurrencyIdLiteral)?.usd;

    if (price === undefined) {
      console.error(`useGetAccountCollateralization: No exchange rate found for currency: ${currency.name}`);
    }

    const positionUSDValue = convertMonetaryAmountToValueInUSD(amount, price);
    return totalValue.add(positionUSDValue || 0);
  }, Big(0));
};

const useGetAccountLoansOverview = (accountId: AccountId | undefined): AccountLoansOverview => {
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
    (type: 'borrow' | 'supply', currency: CurrencyExt, amount: MonetaryAmount<CurrencyExt>) => {
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

  return {
    lendPositions,
    borrowPositions,
    lentAssetsUSDValue,
    totalEarnedInterestUSDValue,
    borrowedAssetsUSDValue,
    collateralRatio,
    getNewCollateralRatio
  };
};

export { useGetAccountLoansOverview };
