import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

// Squid query by currency ticker for native assets and by id for foreign assets.
// We need to differentiate because those are handled differently on squid side.
// TODO: Need to refactor when we want to support lend tokens as collateral for vaults.
const getCurrencyEqualityCondition = (currency: CurrencyExt): string =>
  'foreignAsset' in currency ? `asset_eq: ${currency.foreignAsset.id}` : `token_eq: ${currency.ticker}`;

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
