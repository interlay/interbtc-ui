import { ChainBalance, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';

const MOCK_TOKEN_BALANCE = '1000000000000';
const MOCK_TOKEN_TOTAL_AMOUNT = '10000000000000000000000';

const DEFAULT_TOKENS_BALANCE_FN = (currency: CurrencyExt, _id: AccountId): ChainBalance =>
  new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE);

const EMPTY_TOKENS_BALANCE_FN = (currency: CurrencyExt, _id: AccountId): ChainBalance =>
  new ChainBalance(currency, new Big(0), new Big(0));

const mockTokensBalance = jest.fn().mockImplementation(DEFAULT_TOKENS_BALANCE_FN);

const mockTokensTotal = jest.fn(async (currency: CurrencyExt) => newMonetaryAmount(MOCK_TOKEN_TOTAL_AMOUNT, currency));

const mockTokensSubscribeToBalance = jest.fn((currency: CurrencyExt, account, callback) => {
  const balance = new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE);
  callback(account, balance);

  return () => undefined;
});

export {
  DEFAULT_TOKENS_BALANCE_FN,
  EMPTY_TOKENS_BALANCE_FN,
  MOCK_TOKEN_BALANCE,
  MOCK_TOKEN_TOTAL_AMOUNT,
  mockTokensBalance,
  mockTokensSubscribeToBalance,
  mockTokensTotal
};
