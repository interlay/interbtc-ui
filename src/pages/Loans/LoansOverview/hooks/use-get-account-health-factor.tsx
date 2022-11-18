import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { formatNumber } from '@/common/utils/utils';
import { Status } from '@/component-library';
import { LoanAction } from '@/types/loans';
import { useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { calculateCollateralBorrowedAmountUSD } from '../utils/math';

const healthFactorRanges: Record<Status, number> = {
  error: 1,
  warning: 3,
  success: 10
};

const calculateHealthFactor = (borrowAmountUSD: Big, collateralAmountUSD: Big) =>
  borrowAmountUSD.gt(0) ? collateralAmountUSD.div(borrowAmountUSD).toNumber() : Infinity;

const getStatus = (score: number): Status => {
  if (score <= healthFactorRanges.error) return 'error';
  if (score <= healthFactorRanges.warning) return 'warning';
  return 'success';
};

const statusLabel: Record<Status, string> = {
  error: 'Liquidation Risk',
  warning: 'High Risk',
  success: 'Low Risk'
};

const getStatusLabel = (status: Status): string => statusLabel[status];

const getData = (borrowAmountUSD: Big, collateralAmountUSD: Big) => {
  const value = calculateHealthFactor(borrowAmountUSD, collateralAmountUSD);
  const valueLabel = value > 10 ? '10+' : formatNumber(value, { maximumFractionDigits: 2 });
  const status = getStatus(value);
  const statusLabel = getStatusLabel(status);

  return {
    value,
    valueLabel,
    status,
    statusLabel
  };
};

type LoanActionData = { type: LoanAction; amount: MonetaryAmount<CurrencyExt>; asset: LoanAsset };

type AccountHealthFactorData = {
  value: number;
  valueLabel: string;
  status: Status;
  statusLabel: string;
};

interface UseAccountHealthFactor {
  data: AccountHealthFactorData | undefined;
  getHealthFactor: (loanAction: LoanActionData) => AccountHealthFactorData | undefined;
}

const useGetAccountHealthFactor = (): UseAccountHealthFactor => {
  const prices = useGetPrices();
  const {
    data: { stats }
  } = useGetAccountPositions();
  const { borrowAmountUSD, collateralAmountUSD } = stats || {};

  /**
   * This method computes how the health factor will
   * change if asset is withdrawn or deposited.
   * @param {LoanActionData} loanAction The data related to loan action
   * @note Call only after the prices and positions stats are loaded.
   * @returns {number} Health Factor after the transaction is done.
   */
  const getHealthFactor = useCallback(
    ({ type, amount, asset }: LoanActionData): AccountHealthFactorData | undefined => {
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

      return getData(newTotalBorrowedAmountUSD, newCollateralAssetsUSD);
    },
    [prices, borrowAmountUSD, collateralAmountUSD]
  );

  const data =
    borrowAmountUSD !== undefined && collateralAmountUSD !== undefined
      ? getData(borrowAmountUSD, collateralAmountUSD)
      : undefined;

  return {
    data,
    getHealthFactor
  };
};

export { healthFactorRanges, useGetAccountHealthFactor };
