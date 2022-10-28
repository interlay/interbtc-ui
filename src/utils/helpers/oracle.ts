// ray test touch <
import { CurrencyExt } from '@interlay/interbtc-api';
import { Currency, ExchangeRate } from '@interlay/monetary-js';

import { GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';

const getExchangeRate = async (token: CurrencyExt): Promise<ExchangeRate<Currency, CurrencyExt>> => {
  if (token.ticker === GOVERNANCE_TOKEN_SYMBOL) {
    throw new Error(`No exchange rate for given currency: ${token.ticker}`);
  }

  return await window.bridge.oracle.getExchangeRate(token);
};

export { getExchangeRate };
// ray test touch >
