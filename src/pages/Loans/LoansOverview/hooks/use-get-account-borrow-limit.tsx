import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { LoanAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
import { PriceSource, useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { calculateBorrowedAmountUSD, calculateCollateralAmountUSD, calculateThresholdAmountUSD } from '../utils/math';

const calculateBorrowLimitUSD = (borrowAmountUSD: Big, collateralAmountUSD: Big): Big =>
  collateralAmountUSD.sub(borrowAmountUSD);

type LoanActionData = { type: LoanAction; amount: MonetaryAmount<CurrencyExt>; asset: LoanAsset };

interface UseAccountBorrowLimit {
  data: Big | undefined;
  getBorrowLimitUSD: (loanAction: LoanActionData) => Big | undefined;
}

const useAccountBorrowLimit = (): UseAccountBorrowLimit => {
  const prices = useGetPrices({ source: PriceSource.ORACLE });
  const {
    data: { statistics }
  } = useGetAccountPositions();
  const { borrowAmountUSD, collateralAmountUSD } = statistics || {};

  /**
   * This method computes how the borrow limit will change if
   * asset is withdrawn or deposited to protocol.
   * @param {LoanActionData} loanAction The data related to loan action
   * @note Call only after the prices and positions statistics are loaded.
   * @returns New borrow limit in USD after the transaction is done.
   */
  const getBorrowLimitUSD = useCallback(
    ({ type, amount, asset }: LoanActionData): Big | undefined => {
      if (prices === undefined || borrowAmountUSD === undefined || collateralAmountUSD === undefined) {
        return undefined;
      }
      const { currency, collateralThreshold } = asset;

      const currencyPrice = getTokenPrice(prices, currency.ticker)?.usd;
      const actionAmountUSD = Big(convertMonetaryAmountToValueInUSD(amount, currencyPrice) || 0);

      const newTotalBorrowedAmountUSD = calculateBorrowedAmountUSD(type, borrowAmountUSD, actionAmountUSD);

      const collateralThresholdAmountUSD = calculateThresholdAmountUSD(actionAmountUSD, collateralThreshold);
      const newCollateralAssetsUSD = calculateCollateralAmountUSD(
        type,
        collateralAmountUSD,
        collateralThresholdAmountUSD
      );

      return calculateBorrowLimitUSD(newTotalBorrowedAmountUSD, newCollateralAssetsUSD);
    },
    [borrowAmountUSD, collateralAmountUSD, prices]
  );

  const data =
    borrowAmountUSD !== undefined && collateralAmountUSD !== undefined
      ? calculateBorrowLimitUSD(borrowAmountUSD, collateralAmountUSD)
      : undefined;

  return {
    data,
    getBorrowLimitUSD
  };
};

export { useAccountBorrowLimit };
export type { UseAccountBorrowLimit };
