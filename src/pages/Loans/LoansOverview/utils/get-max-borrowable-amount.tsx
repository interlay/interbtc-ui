import { CurrencyExt, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

/**
 * Get maximum amount of currency that user can borrow
 * with currently provided collateral and liquidity.
 * @param {LoanAsset} asset The asset to be withdrew.
 * @param {number} assetPrice The asset price.
 * @param {Big} totalBorrowedAmountUSD Total borrowed amount in usd.
 * @param {Big} totalCollateralAmountUSD Total provided collateral amount in usd.
 * @return {MonetaryAmount<CurrencyExt> | undefined} maximum amount of currency that
 * user can withdraw with currently provided collateral. Returns undefined if it is loading
 */
const getMaxBorrowableAmount = (
  asset: LoanAsset,
  assetPrice?: number,
  totalBorrowedAmountUSD?: Big,
  totalCollateralAmountUSD?: Big
): MonetaryAmount<CurrencyExt> | undefined => {
  if (assetPrice === undefined || totalCollateralAmountUSD === undefined || totalBorrowedAmountUSD === undefined) {
    return newMonetaryAmount(0, asset.currency);
  }

  const { availableCapacity, currency } = asset;

  const availableCollateralUSDValue = totalCollateralAmountUSD.sub(totalBorrowedAmountUSD);
  const maxBorrowableCurrencyAmount = availableCollateralUSDValue.div(assetPrice);

  const maxBorrowableAmountByCollateral =
    new MonetaryAmount(currency, maxBorrowableCurrencyAmount) || new MonetaryAmount(currency, 0);

  return availableCapacity.gt(maxBorrowableAmountByCollateral) ? maxBorrowableAmountByCollateral : availableCapacity;
};

export { getMaxBorrowableAmount };
