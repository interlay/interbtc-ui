import { CollateralPosition, CurrencyExt, LendingStats, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

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
  const { currency } = asset;

  if (position === undefined || lendingStats === undefined) {
    return newMonetaryAmount(0, currency);
  }

  const { amount, isCollateral } = position;
  const { collateralThreshold, exchangeRate } = asset;
  const { borrowLimitBtc } = lendingStats;

  if (!isCollateral) {
    return amount;
  }

  const positionAmountBtc = exchangeRate.toBase(amount);
  const positionCollateralValueBtc = positionAmountBtc.mul(collateralThreshold);

  if (positionCollateralValueBtc.lt(borrowLimitBtc)) {
    return amount;
  }

  const maxWithdrawable = exchangeRate.toCounter(borrowLimitBtc).div(collateralThreshold).toBig();

  return newMonetaryAmount(maxWithdrawable, currency, true);
};

export { getMaxWithdrawableAmount };
