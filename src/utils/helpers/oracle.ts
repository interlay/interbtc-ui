import { CurrencyExt } from '@interlay/interbtc-api';
import { Bitcoin, Currency, ExchangeRate } from '@interlay/monetary-js';

// import { GOVERNANCE_TOKEN_SYMBOL, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL } from '@/config/relay-chains';

const getExchangeRate = async (
  collateralCurrency: CurrencyExt,
  wrappedCurrency?: Bitcoin
): Promise<ExchangeRate<Currency, CurrencyExt>> => {
  // This is for simulating when the oracle is down.
  // if (collateralCurrency.ticker === GOVERNANCE_TOKEN_SYMBOL) {
  //   throw new Error(`No exchange rate for given currency: ${collateralCurrency.ticker}`);
  // }
  // if (collateralCurrency.ticker === RELAY_CHAIN_NATIVE_TOKEN_SYMBOL) {
  //   throw new Error(`No exchange rate for given currency: ${collateralCurrency.ticker}`);
  // }

  return await window.bridge.oracle.getExchangeRate(collateralCurrency, wrappedCurrency);
};

export { getExchangeRate };
