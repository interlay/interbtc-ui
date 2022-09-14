import { ChainBalance, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';

const DEFAULT_TOKEN_AMOUNT = '1000000000000';

const mockTokensTotal = jest.fn(async (currency: CurrencyExt) => newMonetaryAmount(DEFAULT_TOKEN_AMOUNT, currency));
const mockTokensSubscribeToBalance = jest.fn((currency: CurrencyExt, account, callback) => {
  const balance = new ChainBalance(currency, DEFAULT_TOKEN_AMOUNT, DEFAULT_TOKEN_AMOUNT);
  callback(account, balance);

  return () => undefined;
});

export { mockTokensSubscribeToBalance, mockTokensTotal };
