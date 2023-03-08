import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { MeterRanges, Status } from '@/component-library';
import { LoanAction } from '@/types/loans';
import { useAccountLendingStatistics } from '@/utils/hooks/api/loans/use-account-lending-statistics';
import { PositionsThresholdsData } from '@/utils/hooks/api/loans/use-get-account-positions';

type LTVData = {
  value: number;
  ranges?: MeterRanges;
  status: Status;
};

const getRanges = (thresholds: PositionsThresholdsData): MeterRanges => {
  const collateral = thresholds.collateral.round(2).toNumber();
  const liquidation = thresholds.liquidation.round(2).toNumber();

  return [0, collateral, liquidation, 100];
};

const getStatus = (value: Big, thresholds: PositionsThresholdsData): Status => {
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
  collateralThresholdWeightedAverage: Big,
  liquidationThresholdWeightedAverage: Big
): LTVData => {
  const thresholds = {
    collateral: collateralThresholdWeightedAverage.mul(100),
    liquidation: liquidationThresholdWeightedAverage.mul(100)
  };

  return {
    value: ltv.toNumber() * 100,
    status: getStatus(ltv, thresholds),
    ranges: getRanges(thresholds)
  };
};

type LoanActionData = { type: LoanAction; amount: MonetaryAmount<CurrencyExt> };

interface UserGetLTV {
  data: LTVData | undefined;
  getLTV: (loanAction: LoanActionData) => LTVData | undefined;
}

const useGetLTV = (): UserGetLTV => {
  const {
    data: { statistics }
  } = useAccountLendingStatistics();

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

      return getData(ltv, collateralThresholdWeightedAverage, liquidationThresholdWeightedAverage);
    },
    [statistics]
  );

  const data = statistics
    ? getData(
        statistics.ltv,
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
