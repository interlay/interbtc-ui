import { ChainBalance, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';

const MOCK_TOKEN_BALANCE = '1000000000000';
const MOCK_TOKEN_TOTAL_AMOUNT = '10000000000000000000000';

const mockTokensBalance = jest.fn(
  (currency: CurrencyExt, _id: AccountId) => new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE)
);

const mockTokensTotal = jest.fn(async (currency: CurrencyExt) => newMonetaryAmount(MOCK_TOKEN_TOTAL_AMOUNT, currency));

const mockTokensSubscribeToBalance = jest.fn((currency: CurrencyExt, account, callback) => {
  const balance = new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE);
  callback(account, balance);

  return () => undefined;
});

export { MOCK_TOKEN_BALANCE, mockTokensBalance, mockTokensSubscribeToBalance, mockTokensTotal };
