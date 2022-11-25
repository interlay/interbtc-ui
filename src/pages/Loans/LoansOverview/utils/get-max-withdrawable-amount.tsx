import { CurrencyExt, LendPosition, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

/**
 * Get maximum amount of currency that user can withdraw
 * with currently provided collateral and liquidity.
 * @param {LoanAsset} asset The asset to be withdrew.
 * @param {number} assetPrice The asset price.
 * @param {LendPosition} position The position to be withdrew.
 * @param {Big} totalBorrowedAmountUSD Total borrowed amount in usd.
 * @param {Big} totalCollateralAmountUSD Total provided collateral amount in usd.
 * @return {MonetaryAmount<CurrencyExt> | undefined} maximum amount of currency that
 * user can withdraw with currently provided collateral. Returns undefined if it is loading
 */
const getMaxWithdrawableAmount = (
  asset: LoanAsset,
  assetPrice?: number,
  position?: LendPosition,
  totalBorrowedAmountUSD?: Big,
  totalCollateralAmountUSD?: Big
): MonetaryAmount<CurrencyExt> | undefined => {
  const { currency } = asset;

  if (
    assetPrice === undefined ||
    position === undefined ||
    totalCollateralAmountUSD === undefined ||
    totalBorrowedAmountUSD === undefined
  ) {
    return newMonetaryAmount(0, currency);
  }

  const { amount, isCollateral } = position;
  const { collateralThreshold } = asset;

  if (!isCollateral) {
    return amount;
  }

  const positionAmountUSD = amount.toBig().mul(assetPrice);
  const positionCollateralValueUSD = positionAmountUSD.mul(collateralThreshold);
  const borrowLimit = totalCollateralAmountUSD.sub(totalBorrowedAmountUSD);

  if (positionCollateralValueUSD.lt(borrowLimit)) {
    return amount;
  }

  const maxWithdrawable = borrowLimit.div(assetPrice).div(collateralThreshold);

  return newMonetaryAmount(maxWithdrawable, currency, true);
};

export { getMaxWithdrawableAmount };
