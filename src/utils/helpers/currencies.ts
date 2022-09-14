import { CurrencyExt } from '@interlay/interbtc-api';

// Squid query by currency ticker for native assets and by id for foreign assets.
// We need to differentiate because those are handled differently on squid side.
const getCurrencyEqualityCondition = (currency: CurrencyExt): string =>
    'id' in currency ? `asset_eq: ${currency.id}` : `token_eq: ${currency.ticker}`;

export { getCurrencyEqualityCondition };
