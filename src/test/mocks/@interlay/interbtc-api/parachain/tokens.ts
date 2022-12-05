import { ChainBalance, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';

const DEFAULT_TOKEN_BALANCE = '1000000000000';
const DEFAULT_TOKEN_TOTAL_AMOUNT = '10000000000000000000000';

type MockTokenBalance = jest.Mock<ChainBalance, [currency: CurrencyExt, _id: AccountId]> & { emptyBalance: () => void };

const tokensBalanceFn = jest.fn(
  (currency: CurrencyExt, _id: AccountId) => new ChainBalance(currency, DEFAULT_TOKEN_BALANCE, DEFAULT_TOKEN_BALANCE)
);

(tokensBalanceFn as MockTokenBalance).emptyBalance = () =>
  tokensBalanceFn.mockImplementation(
    (currency: CurrencyExt, _id: AccountId) => new ChainBalance(currency, new Big(0), new Big(0))
  );

const mockTokensBalance = tokensBalanceFn as MockTokenBalance;

const mockTokensTotal = jest.fn(async (currency: CurrencyExt) =>
  newMonetaryAmount(DEFAULT_TOKEN_TOTAL_AMOUNT, currency)
);

const mockTokensSubscribeToBalance = jest.fn((currency: CurrencyExt, account, callback) => {
  const balance = new ChainBalance(currency, DEFAULT_TOKEN_BALANCE, DEFAULT_TOKEN_BALANCE);
  callback(account, balance);

  return () => undefined;
});

export {
  DEFAULT_TOKEN_BALANCE,
  DEFAULT_TOKEN_TOTAL_AMOUNT,
  mockTokensBalance,
  mockTokensSubscribeToBalance,
  mockTokensTotal
};
