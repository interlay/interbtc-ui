import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { LoanAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';

import { useGetPrices } from '../use-get-prices';
import { useGetAccountLoansOverview } from './use-get-account-loans-overview';
import { useGetLoanAssets } from './use-get-loan-assets';
import { calculateAssetMinCollateralUSD, calculateBorrowedAmountUSD, calculateCollateralAmountUSD } from './utils';

const calculateHealthFactor = (borrowAmountUSD: Big, collateralAmountUSD: Big) =>
  borrowAmountUSD.gt(0) ? collateralAmountUSD.div(borrowAmountUSD).toNumber() : Infinity;

const getCurrenctHealthFactor = (borrowAmountUSD?: Big, collateralAmountUSD?: Big): number | undefined => {
  if (borrowAmountUSD === undefined || collateralAmountUSD === undefined) {
    return undefined;
  }

  return calculateHealthFactor(borrowAmountUSD, collateralAmountUSD);
};

type LoanActionData = { type: LoanAction; amount: MonetaryAmount<CurrencyExt> };

interface UseLoansHealthFactor {
  data: number | undefined;
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

      const assetMinCollateralUSD = calculateAssetMinCollateralUSD(actionAmountUSD, assets[ticker].collateralThreshold);
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
    data: getCurrenctHealthFactor(borrowedAssetsUSDValue, collateralAssetsUSDValue),
    getHealthFactor
  };
};

export { useLoansHealthFactor };
