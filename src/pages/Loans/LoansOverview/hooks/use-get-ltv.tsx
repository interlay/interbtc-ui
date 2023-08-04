import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { MeterRanges, Status } from '@/component-library';
import { useGetAccountLendingStatistics } from '@/hooks/api/loans/use-get-account-lending-statistics';
import { LoanAction } from '@/types/loans';

interface PositionsThresholds {
  collateral: Big;
  liquidation: Big;
}

type LTVData = {
  value: number;
  ranges?: MeterRanges;
  status: Status;
};

const getRanges = (thresholds: PositionsThresholds): MeterRanges => {
  const collateral = thresholds.collateral.round(2).toNumber();
  const liquidation = thresholds.liquidation.round(2).toNumber();

  return [0, collateral, liquidation, 100];
};

const getStatus = (value: Big, thresholds: PositionsThresholds): Status => {
  if (value.gte(thresholds.liquidation)) {
    return 'error';
  }

  if (value.gte(thresholds.collateral)) {
    return 'warning';
  }

  return 'success';
};

const getData = (
  ltv: Big,
  borrowedAmount: MonetaryAmount<CurrencyExt>,
  collateralThresholdWeightedAverage: Big,
  liquidationThresholdWeightedAverage: Big
): LTVData => {
  // if ltv is 0
  // 1. and there are still assets being
  // borrowed then status is error, meaning that the user
  // should not be able to apply action
  // 2. and there are no assets being borrowed then
  // the user should successfuly apply action
  if (collateralThresholdWeightedAverage.eq(0)) {
    const hasBorrowedAssets = borrowedAmount.toBig().gt(0);

    return {
      status: hasBorrowedAssets ? 'error' : 'success',
      ranges: undefined,
      value: hasBorrowedAssets ? 100 : 0
    };
  }

  const ltvPercentage = ltv.mul(100);

  const thresholds = {
    collateral: collateralThresholdWeightedAverage.mul(100),
    liquidation: liquidationThresholdWeightedAverage.mul(100)
  };

  return {
    value: ltvPercentage.toNumber(),
    status: getStatus(ltvPercentage, thresholds),
    ranges: getRanges(thresholds)
  };
};

type LoanActionData = { type: LoanAction; amount: MonetaryAmount<CurrencyExt> };

interface UserGetLTV {
  data: LTVData | undefined;
  getLTV: (loanAction: LoanActionData) => LTVData | undefined;
}

const useGetLTV = (): UserGetLTV => {
  const { data: statistics } = useGetAccountLendingStatistics();

  /**
   * This method computes how the LTV will
   * change if asset is withdrawn or deposited.
   * @param {LoanActionData} loanAction The data related to loan action
   * @note Call only after the prices and positions statistics are loaded.
   * @returns {number} Health Factor after the transaction is done.
   */
  const getLTV = useCallback(
    ({ type, amount }: LoanActionData): LTVData | undefined => {
      if (statistics === undefined) {
        return undefined;
      }

      const {
        ltv,
        collateralThresholdWeightedAverage,
        liquidationThresholdWeightedAverage
      } = statistics.calculateLtvAndThresholdsChange(type, amount);

      return getData(
        ltv,
        statistics.totalBorrowedBtc,
        collateralThresholdWeightedAverage,
        liquidationThresholdWeightedAverage
      );
    },
    [statistics]
  );

  const data = statistics
    ? getData(
        statistics.ltv,
        statistics.totalBorrowedBtc,
        statistics.collateralThresholdWeightedAverage,
        statistics.liquidationThresholdWeightedAverage
      )
    : undefined;

  return {
    data,
    getLTV
  };
};

export { useGetLTV };
