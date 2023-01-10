import { CurrencyExt } from '@interlay/interbtc-api';
import { Bitcoin, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';

// ray test touch <<
const MOCK_EXCHANGE_RATE = new Big(1000000);
// ray test touch >>

const mockOracleGetExchangeRate = jest.fn(
  // ray test touch <<
  (currency: CurrencyExt) => new ExchangeRate(Bitcoin, currency, MOCK_EXCHANGE_RATE)
  // ray test touch >>
);

export { MOCK_EXCHANGE_RATE, mockOracleGetExchangeRate };
