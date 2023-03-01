import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { MeterRanges, Status } from '@/component-library';
import { LoanAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useLoanInfo } from '@/utils/hooks/api/loans/lend-and-borrow-info';
import { PositionsThresholdsData } from '@/utils/hooks/api/loans/use-get-account-positions';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { calculateBorrowedAmountUSD, calculateCollateralAmountUSD, calculateThresholdAmountUSD } from '../utils/math';

type LTVData = {
  value: number;
  ranges?: MeterRanges;
  status: Status;
};

type GetDataParams = {
  borrowAmountUSD: Big;
  collateralAmountUSD: Big;
  collateralizedAmountUSD: Big;
  liquidationAmountUSD: Big;
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

const getData = (data: GetDataParams): LTVData => {
  const { borrowAmountUSD, collateralAmountUSD, collateralizedAmountUSD, liquidationAmountUSD } = data;

  // if collateral is 0:
  // 1. and there are still assets being
  // borrowed then status is error, meaning that the user
  // should not be able to apply action
  // 2. and there are no assets being borrowed then
  // the user should successfuly apply action
  if (!collateralAmountUSD.gt(0) || !liquidationAmountUSD.gte(0) || !collateralizedAmountUSD.gt(0)) {
    const hasBorrowedAssets = borrowAmountUSD.gt(0);

    return {
      status: hasBorrowedAssets ? 'error' : 'success',
      ranges: undefined,
      value: hasBorrowedAssets ? 100 : 0
    };
  }

  const value = borrowAmountUSD.div(collateralizedAmountUSD).mul(100);

  const thresholds = {
    collateral: collateralAmountUSD.div(collateralizedAmountUSD).mul(100),
    liquidation: liquidationAmountUSD.div(collateralizedAmountUSD).mul(100)
  };

  return {
    value: value.toNumber(),
    status: getStatus(value, thresholds),
    ranges: getRanges(thresholds)
  };
};

type LoanActionData = { type: LoanAction; amount: MonetaryAmount<CurrencyExt>; asset: LoanAsset };

interface UserGetLTV {
  data: LTVData | undefined;
  getLTV: (loanAction: LoanActionData) => LTVData | undefined;
}

const useGetLTV = (): UserGetLTV => {
  const prices = useGetPrices();
  // ray test touch <<
  const {
    data: { statistics }
  } = useLoanInfo();
  // ray test touch >>
  const { borrowAmountUSD, collateralizedAmountUSD, collateralAmountUSD, liquidationAmountUSD } = statistics || {};
  // ray test touch <<
  // console.log('ray : ***** borrowAmountUSD?.toString() => ', borrowAmountUSD?.toString());
  // console.log('ray : ***** collateralizedAmountUSD?.toString() => ', collateralizedAmountUSD?.toString());
  // console.log('ray : ***** collateralAmountUSD?.toString() => ', collateralAmountUSD?.toString());
  // console.log('ray : ***** liquidationAmountUSD?.toString() => ', liquidationAmountUSD?.toString());
  // ray test touch >>

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
        collateralAmountUSD === undefined ||
        liquidationAmountUSD === undefined
      ) {
        return undefined;
      }

      const { currency, collateralThreshold, liquidationThreshold } = asset;

      const currencyPrice = getTokenPrice(prices, currency.ticker)?.usd;
      const actionAmountUSD = Big(convertMonetaryAmountToValueInUSD(amount, currencyPrice) || 0);

      const collateralThresholdAmountUSD = calculateThresholdAmountUSD(actionAmountUSD, collateralThreshold);
      const liquidationThresholdAmountUSD = calculateThresholdAmountUSD(actionAmountUSD, liquidationThreshold);

      const data = {
        borrowAmountUSD: calculateBorrowedAmountUSD(type, borrowAmountUSD, actionAmountUSD),
        collateralAmountUSD: calculateCollateralAmountUSD(type, collateralAmountUSD, collateralThresholdAmountUSD),
        collateralizedAmountUSD: calculateCollateralAmountUSD(type, collateralizedAmountUSD, actionAmountUSD),
        liquidationAmountUSD: calculateCollateralAmountUSD(type, liquidationAmountUSD, liquidationThresholdAmountUSD)
      };

      return getData(data);
    },
    [prices, borrowAmountUSD, collateralizedAmountUSD, collateralAmountUSD, liquidationAmountUSD]
  );

  const data =
    borrowAmountUSD !== undefined &&
    collateralAmountUSD !== undefined &&
    collateralizedAmountUSD !== undefined &&
    liquidationAmountUSD !== undefined
      ? getData({ borrowAmountUSD, collateralAmountUSD, collateralizedAmountUSD, liquidationAmountUSD })
      : undefined;

  return {
    data,
    getLTV
  };
};

export { useGetLTV };
