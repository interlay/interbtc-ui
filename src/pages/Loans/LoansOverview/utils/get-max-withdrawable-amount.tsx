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

  const positionAmountUSD = amount.toBig().mul(assetPrice);

  if (!isCollateral || positionAmountUSD.lt(totalCollateralAmountUSD.sub(totalBorrowedAmountUSD))) {
    return amount;
  }

  const minCollateralNeeded = totalBorrowedAmountUSD.div(collateralThreshold);

  const maxWithdrawable = positionAmountUSD.sub(minCollateralNeeded).div(assetPrice);

  return newMonetaryAmount(maxWithdrawable, currency, true);
};

export { getMaxWithdrawableAmount };
