import { CurrencyExt } from '@interlay/interbtc-api';

const getCurrency = (currencies: Array<CurrencyExt>, ticker: string): CurrencyExt => {
  const targetCurrency = currencies.find((currency) => currency.ticker === ticker);

  if (targetCurrency === undefined) {
    throw new Error('Something went wrong!');
  }

  return targetCurrency;
};

// Squid query by currency ticker for native assets and by id for foreing assets.
// We need to differentiate because those are handled differently on squid side.
const getCurrencyEqQuery = (currency: CurrencyExt): string => 'id' in currency ? `asset_eq: ${currency.id}` : `token_eq: ${currency.ticker}`

export { getCurrency, getCurrencyEqQuery };
