import { CurrencyExt, LendingStats, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

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

export { getMaxBorrowableAmount };
