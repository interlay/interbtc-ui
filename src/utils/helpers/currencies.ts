import { CurrencyExt } from '@interlay/interbtc-api';

// Squid query by currency ticker for native assets and by id for foreign assets.
// We need to differentiate because those are handled differently on squid side.
// TODO: Need to refactor when we want to support lend tokens as collateral for vaults.
const getCurrencyEqualityCondition = (currency: CurrencyExt): string =>
  'foreignAsset' in currency ? `asset_eq: ${currency.foreignAsset.id}` : `token_eq: ${currency.ticker}`;

export { getCurrencyEqualityCondition };
