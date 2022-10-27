import { ChainBalance, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';

const DEFAULT_TOKEN_BALANCE = '1000000000000';
const DEFAULT_TOKEN_TOTAL_AMOUNT = '10000000000000000000000';

const mockTokensBalance = jest.fn(
  (currency: CurrencyExt, _id: AccountId) => new ChainBalance(currency, DEFAULT_TOKEN_BALANCE, DEFAULT_TOKEN_BALANCE)
);
const mockTokensTotal = jest.fn(async (currency: CurrencyExt) =>
  newMonetaryAmount(DEFAULT_TOKEN_TOTAL_AMOUNT, currency)
);
const mockTokensSubscribeToBalance = jest.fn((currency: CurrencyExt, account, callback) => {
  const balance = new ChainBalance(currency, DEFAULT_TOKEN_BALANCE, DEFAULT_TOKEN_BALANCE);
  callback(account, balance);

  return () => undefined;
});

export { mockTokensBalance, mockTokensSubscribeToBalance, mockTokensTotal };
