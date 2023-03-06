import { CurrencyExt, LendPosition, LoanAsset, LoanCollateralInfo, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

/**
 * Get maximum amount of currency that user can withdraw
 * with currently provided collateral and liquidity.
 * @param {LoanAsset} asset The asset to be withdrawn.
 * @param {LendPosition} position The position to be withdrew.
 * @param {LoanCollateralInfo} loanCollateralInfo Object containing information about account's collateralization.
 * @return {MonetaryAmount<CurrencyExt> | undefined} maximum amount of currency that
 * user can withdraw with currently provided collateral. Returns undefined if it is loading
 */
const getMaxWithdrawableAmount = (
  asset: LoanAsset,
  position?: LendPosition,
  loanCollateralInfo?: LoanCollateralInfo
): MonetaryAmount<CurrencyExt> | undefined => {
  const { currency } = asset;

  if (position === undefined || loanCollateralInfo === undefined) {
    return newMonetaryAmount(0, currency);
  }

  const { amount, isCollateral } = position;
  const { collateralThreshold, exchangeRate } = asset;
  const { borrowLimitBtc } = loanCollateralInfo;

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
