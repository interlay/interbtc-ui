import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { Status } from '@/component-library';
import { LoanAction } from '@/types/loans';
import { PositionsThresholdsData, useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { calculateCollateralBorrowedAmountUSD } from '../utils/math';

const calculateLTV = (borrowAmountUSD: Big, collateralAmountUSD: Big): Big =>
  borrowAmountUSD.div(collateralAmountUSD).mul(100);

type LTVData = {
  value: number;
  status: Status;
};

const getData = (borrowAmountUSD: Big, collateralAmountUSD: Big, threshold: PositionsThresholdsData): LTVData => {
  const value = calculateLTV(borrowAmountUSD, collateralAmountUSD);

  let status: Status = 'success';

  if (value.gte(threshold.liquidation)) {
    status = 'error';
  } else if (value.gte(threshold.collateral)) {
    status = 'warning';
  }

  return {
    value: value.gte(0) ? Math.floor(value.toNumber() * 100) / 100 : 0,
    status
  };
};

type LoanActionData = { type: LoanAction; amount: MonetaryAmount<CurrencyExt>; asset: LoanAsset };

interface UseAccountHealthFactor {
  data: LTVData | undefined;
  getLTV: (loanAction: LoanActionData) => LTVData | undefined;
}

const useGetLTV = (): UseAccountHealthFactor => {
  const prices = useGetPrices();
  const {
    data: { statistics }
  } = useGetAccountPositions();
  const { borrowAmountUSD, collateralizedAmountUSD, thresholds } = statistics || {};

  /**
   * This method computes how the LTV will
   * change if asset is withdrawn or deposited.
   * @param {LoanActionData} loanAction The data related to loan action
   * @note Call only after the prices and positions statistics are loaded.
   * @returns {number} Health Factor after the transaction is done.
   */
  const getLTV = useCallback(
    ({ type, amount, asset }: LoanActionData): LTVData | undefined => {
      if (
        prices === undefined ||
        borrowAmountUSD === undefined ||
        collateralizedAmountUSD === undefined ||
        thresholds === undefined
      ) {
        return undefined;
      }

      const {
        collateralAssetsUSD: newCollateralAssetsUSD,
        totalBorrowedAmountUSD: newTotalBorrowedAmountUSD
      } = calculateCollateralBorrowedAmountUSD(
        type,
        prices,
        borrowAmountUSD,
        collateralizedAmountUSD,
        amount,
        asset.collateralThreshold
      );

      return getData(newTotalBorrowedAmountUSD, newCollateralAssetsUSD, thresholds);
    },
    [prices, borrowAmountUSD, collateralizedAmountUSD, thresholds]
  );

  const data =
    borrowAmountUSD !== undefined && collateralizedAmountUSD !== undefined && thresholds !== undefined
      ? getData(borrowAmountUSD, collateralizedAmountUSD, thresholds)
      : undefined;

  return {
    data,
    getLTV
  };
};

export { useGetLTV };
