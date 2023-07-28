import {
  BorrowPosition,
  CollateralPosition,
  CurrencyExt,
  LendingStats,
  LoanAsset,
  newMonetaryAmount
} from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { useGetAccountLendingStatistics } from '@/hooks/api/loans/use-get-account-lending-statistics';
import { useGetBalances } from '@/hooks/api/tokens/use-get-balances';
import { BorrowAction, LendAction, LoanAction } from '@/types/loans';
import { pickSmallerAmount } from '@/utils/helpers/currencies';

/**
 * Get maximum amount of currency that user can borrow
 * with currently provided collateral and liquidity.
 * @param {LoanAsset} asset The asset to be withdrawn.s
 * @param {LendingStats} lendingStats Object containing information about account's collateralization.
 * @return {MonetaryAmount<CurrencyExt>} maximum amount of currency that
 * user can withdraw with currently provided collateral
 */
const getMaxBorrowableAmount = (asset: LoanAsset, lendingStats?: LendingStats): MonetaryAmount<CurrencyExt> => {
  if (lendingStats === undefined) {
    return newMonetaryAmount(0, asset.currency);
  }
  const { exchangeRate } = asset;

  const { availableCapacity, currency, borrowCap, totalBorrows } = asset;

  const maxBorrowableCurrencyAmount = exchangeRate.toCounter(lendingStats.borrowLimitBtc);
  const protocolLimitAmount = pickSmallerAmount(availableCapacity, borrowCap.sub(totalBorrows));
  const maxBorrowableAmount = pickSmallerAmount(protocolLimitAmount, maxBorrowableCurrencyAmount);

  if (maxBorrowableAmount.toBig().lte(0)) {
    return newMonetaryAmount(0, currency);
  }

  return maxBorrowableAmount;
};

const getMaxLendableAmount = (asset: LoanAsset): MonetaryAmount<CurrencyExt> => {
  const { totalLiquidity, supplyCap, currency, totalBorrows } = asset;
  const amountInProtocol = totalLiquidity.sub(totalBorrows);
  const maximumAmountToSupply = supplyCap.sub(amountInProtocol);

  if (maximumAmountToSupply.toBig().lte(0)) {
    return newMonetaryAmount(0, currency);
  }
  return maximumAmountToSupply;
};

const getMaxWithdrawableAmountByBorrowLimit = (
  asset: LoanAsset,
  position: CollateralPosition,
  lendingStats: LendingStats
): MonetaryAmount<CurrencyExt> => {
  const { amount, isCollateral, vaultCollateralAmount } = position;
  const { collateralThreshold, exchangeRate, currency } = asset;
  const { borrowLimitBtc } = lendingStats;

  if (!isCollateral) {
    // MEMO: If the position is not used as loan collateral it can be used
    // as vault collateral.
    return amount.sub(vaultCollateralAmount);
  }

  const positionAmountBtc = exchangeRate.toBase(amount);
  const positionCollateralValueBtc = positionAmountBtc.mul(collateralThreshold);

  if (positionCollateralValueBtc.lt(borrowLimitBtc)) {
    return amount;
  }

  const maxWithdrawable = exchangeRate.toCounter(borrowLimitBtc).div(collateralThreshold).toBig();

  return newMonetaryAmount(maxWithdrawable, currency, true);
};

/**
 * Get maximum amount of currency that user can withdraw
 * with currently provided collateral and liquidity.
 * @param {LoanAsset} asset The asset to be withdrawn.
 * @param {CollateralPosition} position The position to be withdrew.
 * @param {LendingStats} lendingStats Object containing information about account's collateralization.
 * @return {MonetaryAmount<CurrencyExt> | undefined} maximum amount of currency that
 * user can withdraw with currently provided collateral
 */
const getMaxWithdrawableAmount = (
  asset: LoanAsset,
  position?: CollateralPosition,
  lendingStats?: LendingStats
): MonetaryAmount<CurrencyExt> => {
  const { currency, availableCapacity } = asset;

  if (position === undefined || lendingStats === undefined) {
    return newMonetaryAmount(0, currency);
  }

  const maxWithdrawableAmountByBorrowLimit = getMaxWithdrawableAmountByBorrowLimit(asset, position, lendingStats);

  return pickSmallerAmount(maxWithdrawableAmountByBorrowLimit, availableCapacity);
};

type GetMaxAmountParams = {
  action: LoanAction;
  asset: LoanAsset;
  assetBalance?: MonetaryAmount<CurrencyExt>;
  position?: CollateralPosition | BorrowPosition;
  lendingStats?: LendingStats;
};

const getMaxCalculatedAmount = ({
  action,
  asset,
  position,
  lendingStats
}: GetMaxAmountParams): MonetaryAmount<CurrencyExt> => {
  switch (action) {
    case 'lend':
      return getMaxLendableAmount(asset);
    case 'withdraw':
      return getMaxWithdrawableAmount(asset, position as CollateralPosition, lendingStats);
    case 'borrow':
      return getMaxBorrowableAmount(asset, lendingStats);
    case 'repay':
      return position
        ? position.amount.add((position as BorrowPosition).accumulatedDebt)
        : newMonetaryAmount(0, asset.currency);
  }
};

type UseGetLoanLimitsAmountData = {
  minAmount: MonetaryAmount<CurrencyExt>;
  maxAmount: MonetaryAmount<CurrencyExt>;
};

const useGetLoanLimitsAmount = (
  action: BorrowAction | LendAction,
  asset?: LoanAsset,
  position?: CollateralPosition | BorrowPosition
): UseGetLoanLimitsAmountData | Record<string, never> => {
  const { getAvailableBalance } = useGetBalances();
  const { data: statistics } = useGetAccountLendingStatistics();

  if (!asset) {
    return {};
  }

  const zeroAssetAmount = newMonetaryAmount(0, asset.currency);

  const assetBalance = getAvailableBalance(asset.currency.ticker) || zeroAssetAmount;

  const minAmount = newMonetaryAmount(1, assetBalance.currency);

  const maxAmountParams: GetMaxAmountParams = {
    action,
    asset,
    assetBalance,
    position,
    lendingStats: statistics
  };
  const maxCalculatedAmount = getMaxCalculatedAmount(maxAmountParams);

  const maxAmount =
    action === 'lend' || action === 'repay'
      ? maxCalculatedAmount.gt(assetBalance)
        ? assetBalance
        : maxCalculatedAmount
      : maxCalculatedAmount;

  return {
    minAmount,
    maxAmount
  };
};

export { useGetLoanLimitsAmount };
export type { UseGetLoanLimitsAmountData };
