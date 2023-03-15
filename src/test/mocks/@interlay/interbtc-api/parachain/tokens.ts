import { ChainBalance, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';

const MOCK_TOKEN_BALANCE = '1000000000000';
const MOCK_TOKEN_TOTAL_AMOUNT = '10000000000000000000000';

type MockTokenBalance = jest.Mock<ChainBalance, [currency: CurrencyExt, _id: AccountId]> & {
  emptyBalance: () => void;
  restore: () => void;
};

const tokensBalanceFn = jest.fn(
  (currency: CurrencyExt, _id: AccountId) =>
    new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE)
);

// Set empty balance
(tokensBalanceFn as MockTokenBalance).emptyBalance = () =>
  tokensBalanceFn.mockImplementation(
    (currency: CurrencyExt, _id: AccountId) => new ChainBalance(currency, new Big(0), new Big(0))
  );

(tokensBalanceFn as MockTokenBalance).restore = () =>
  tokensBalanceFn.mockImplementation(
    (currency: CurrencyExt, _id: AccountId) =>
      new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE)
  );

const mockTokensBalance = tokensBalanceFn as MockTokenBalance;

const mockTokensTotal = jest.fn(async (currency: CurrencyExt) => newMonetaryAmount(MOCK_TOKEN_TOTAL_AMOUNT, currency));

const mockTokensSubscribeToBalance = jest.fn((currency: CurrencyExt, account, callback) => {
  const balance = new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE);
  callback(account, balance);

  return () => undefined;
});

export {
  MOCK_TOKEN_BALANCE,
  MOCK_TOKEN_TOTAL_AMOUNT,
  mockTokensBalance,
  mockTokensSubscribeToBalance,
  mockTokensTotal
};
