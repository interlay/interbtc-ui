import { CurrencyExt } from '@interlay/interbtc-api';
import { Bitcoin, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';

const DEFAULT_EXCHANGE_RATE = '1000000';

const mockOracleGetExchangeRate = jest.fn(
  (currency: CurrencyExt) => new ExchangeRate(Bitcoin, currency, Big(DEFAULT_EXCHANGE_RATE))
);

export { mockOracleGetExchangeRate };
