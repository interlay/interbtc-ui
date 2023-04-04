import { CurrencyExt, StandardLpToken } from '@interlay/interbtc-api';

import { CoinIconProps } from '@/component-library';

const getCoinIconProps = (currency: CurrencyExt): Pick<CoinIconProps, 'ticker' | 'tickers'> => {
  if ((currency as StandardLpToken)?.lpToken) {
    return {
      ticker: currency.ticker,
      tickers: Object.values((currency as StandardLpToken).lpToken).map((token) => token.ticker)
    };
  }

  return {
    ticker: currency.ticker
  };
};

export { getCoinIconProps };
