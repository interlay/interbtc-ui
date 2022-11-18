import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { LoanAction } from '@/types/loans';
import { useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { calculateCollateralBorrowedAmountUSD } from '../utils/math';

const calculateBorrowLimitUSD = (borrowAmountUSD: Big, collateralAmountUSD: Big): Big =>
  collateralAmountUSD.sub(borrowAmountUSD);

type LoanActionData = { type: LoanAction; amount: MonetaryAmount<CurrencyExt>; asset: LoanAsset };

interface UseAccountBorrowLimit {
  data: Big | undefined;
  getBorrowLimitUSD: (loanAction: LoanActionData) => Big | undefined;
}

const useAccountBorrowLimit = (): UseAccountBorrowLimit => {
  const prices = useGetPrices();
  const {
    data: { stats }
  } = useGetAccountPositions();
  const { borrowAmountUSD, collateralAmountUSD } = stats || {};

  /**
   * This method computes how the borrow limit will change if
   * asset is withdrawn or deposited to protocol.
   * @param {LoanActionData} loanAction The data related to loan action
   * @note Call only after the prices and positions stats are loaded.
   * @returns New borrow limit in USD after the transaction is done.
   */
  const getBorrowLimitUSD = useCallback(
    ({ type, amount, asset }: LoanActionData): Big | undefined => {
      if (prices === undefined || borrowAmountUSD === undefined || collateralAmountUSD === undefined) {
        return undefined;
      }

      const {
        collateralAssetsUSD: newCollateralAssetsUSD,
        totalBorrowedAmountUSD: newTotalBorrowedAmountUSD
      } = calculateCollateralBorrowedAmountUSD(
        type,
        prices,
        borrowAmountUSD,
        collateralAmountUSD,
        amount,
        asset.collateralThreshold
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
