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

const calculateBorrowLimitUSD = (borrowAmountUSD: Big, collateralAmountUSD: Big): Big =>
  collateralAmountUSD.sub(borrowAmountUSD);

const getCurrenctBorrowLimitUSD = (borrowAmountUSD?: Big, collateralAmountUSD?: Big): Big | undefined => {
  if (borrowAmountUSD === undefined || collateralAmountUSD === undefined) {
    return undefined;
  }

  return calculateBorrowLimitUSD(borrowAmountUSD, collateralAmountUSD);
};

type LoanActionData = { type: LoanAction; amount: MonetaryAmount<CurrencyExt> };

interface UseLoansHealthFactor {
  data: Big | undefined;
  getBorrowLimitUSD: (loanAction: LoanActionData) => Big | undefined;
}

const useAccountBorrowLimit = (): UseLoansHealthFactor => {
  const prices = useGetPrices();
  const {
    data: { borrowedAssetsUSDValue, collateralAssetsUSDValue }
  } = useGetAccountLoansOverview();
  const { assets } = useGetLoanAssets();

  /**
   * This method computes how the borrow limit will change if
   * asset is withdrawn or deposited to protocol.
   * @param type Type of transaction to be done.
   * @param currency Currency which will be deposited or withdrawn.
   * @param amount Amount of `currency` that will be used.
   * @note Call only after the prices and positions are loaded.
   * @returns New borrow limit in USD after the transaction is done.
   */
  const getBorrowLimitUSD = useCallback(
    ({ type, amount }: LoanActionData): Big | undefined => {
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

      return newCollateralAssetsUSDValue.sub(newTotalBorrowedAmountUSD);
    },
    [prices, borrowedAssetsUSDValue, collateralAssetsUSDValue, assets]
  );

  return {
    data: getCurrenctBorrowLimitUSD(borrowedAssetsUSDValue, collateralAssetsUSDValue),
    getBorrowLimitUSD
  };
};

export { useAccountBorrowLimit };