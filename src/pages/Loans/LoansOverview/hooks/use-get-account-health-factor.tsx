import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { LoanAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';
import { useGetLoanAssets } from '@/utils/hooks/api/loans/use-get-loan-assets';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { calculateBorrowedAmountUSD, calculateCollateralAmountUSD, calculateCollateralUSD } from '../utils/math';

const calculateHealthFactor = (borrowAmountUSD: Big, collateralAmountUSD: Big) =>
  borrowAmountUSD.gt(0) ? collateralAmountUSD.div(borrowAmountUSD).toNumber() : Infinity;

const getCurrencyHealthFactor = (borrowAmountUSD?: Big, collateralAmountUSD?: Big): number | undefined => {
  if (borrowAmountUSD === undefined || collateralAmountUSD === undefined) {
    return undefined;
  }

  return calculateHealthFactor(borrowAmountUSD, collateralAmountUSD);
};

type LoanActionData = { type: LoanAction; amount: MonetaryAmount<CurrencyExt> };

interface UseLoansHealthFactor {
  healthFactor: number | undefined;
  getHealthFactor: (loanAction: LoanActionData) => number | undefined;
}

const useLoansHealthFactor = (): UseLoansHealthFactor => {
  const prices = useGetPrices();
  const {
    data: { borrowedAssetsUSDValue, collateralAssetsUSDValue }
  } = useGetAccountLoansOverview();
  const { assets } = useGetLoanAssets();

  /**
   * This method computes how the health factor will change if
   * asset is withdrawn or deposited.
   * @param type Type of transaction that will be done.
   * @param amount Amount of `currency` that will be used.
   * @note Call only after the prices and positions are loaded.
   * @returns {number} Health Factor after the transaction is done.
   */
  const getHealthFactor = useCallback(
    ({ type, amount }: LoanActionData): number | undefined => {
      if (
        prices === undefined ||
        borrowedAssetsUSDValue === undefined ||
        collateralAssetsUSDValue === undefined ||
        assets === undefined
      ) {
        return undefined;
      }

      const {
        currency: { ticker }
      } = amount;

      const currencyPrice = getTokenPrice(prices, ticker)?.usd;
      const actionAmountUSD = Big(convertMonetaryAmountToValueInUSD(amount, currencyPrice) || 0);

      const newTotalBorrowedAmountUSD = calculateBorrowedAmountUSD(type, borrowedAssetsUSDValue, actionAmountUSD);

      const assetMinCollateralUSD = calculateCollateralUSD(actionAmountUSD, assets[ticker].collateralThreshold);
      const newCollateralAssetsUSDValue = calculateCollateralAmountUSD(
        type,
        collateralAssetsUSDValue,
        assetMinCollateralUSD
      );

      return calculateHealthFactor(newTotalBorrowedAmountUSD, newCollateralAssetsUSDValue);
    },
    [prices, borrowedAssetsUSDValue, collateralAssetsUSDValue, assets]
  );

  return {
    healthFactor: getCurrencyHealthFactor(borrowedAssetsUSDValue, collateralAssetsUSDValue),
    getHealthFactor
  };
};

export { useLoansHealthFactor };
