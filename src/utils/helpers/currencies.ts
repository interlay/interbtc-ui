import { CurrencyExt, isForeignAsset, isLendToken } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

// Squid query by currency ticker for native assets and by id for foreign assets.
// We need to differentiate because those are handled differently on squid side.

const getCurrencyEqualityCondition = (currency: CurrencyExt): string => {
  if (isForeignAsset(currency)) {
    return `asset_eq: ${currency.foreignAsset.id}`;
  }
  if (isLendToken(currency)) {
    return `lendTokenId_eq: ${currency.lendToken.id}`;
  }
  return `token_eq: ${currency.ticker}`;
};

const pickSmallerAmount = (
  amount0: MonetaryAmount<CurrencyExt>,
  amount1: MonetaryAmount<CurrencyExt>
): MonetaryAmount<CurrencyExt> => {
  if (amount0.lte(amount1)) {
    return amount0;
  }
  return amount1;
};

export { getCurrencyEqualityCondition, pickSmallerAmount };
