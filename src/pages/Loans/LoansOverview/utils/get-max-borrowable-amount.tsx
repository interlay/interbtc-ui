import { CurrencyExt, LoanAsset, LoanCollateralInfo, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { pickSmallerAmount } from '@/utils/helpers/currencies';

/**
 * Get maximum amount of currency that user can borrow
 * with currently provided collateral and liquidity.
 * @param {LoanAsset} asset The asset to be withdrawn.s
 * @param {LoanCollateralInfo} loanCollateralInfo Object containing information about account's collateralization.
 * @return {MonetaryAmount<CurrencyExt> | undefined} maximum amount of currency that
 * user can withdraw with currently provided collateral. Returns undefined if it is loading
 */
const getMaxBorrowableAmount = (
  asset: LoanAsset,
  loanCollateralInfo?: LoanCollateralInfo
): MonetaryAmount<CurrencyExt> | undefined => {
  if (loanCollateralInfo === undefined) {
    return newMonetaryAmount(0, asset.currency);
  }
  const { exchangeRate } = asset;

  const { availableCapacity, currency, borrowCap, totalBorrows } = asset;

  const maxBorrowableCurrencyAmount = exchangeRate.toCounter(loanCollateralInfo.borrowLimitBtc);
  const protocolLimitAmount = pickSmallerAmount(availableCapacity, borrowCap.sub(totalBorrows));
  const maxBorrowableAmount = pickSmallerAmount(protocolLimitAmount, maxBorrowableCurrencyAmount);

  if (maxBorrowableAmount.toBig().lte(0)) {
    return newMonetaryAmount(0, currency);
  }

  return maxBorrowableAmount;
};

export { getMaxBorrowableAmount };
