import { newMonetaryAmount } from '@interlay/interbtc-api';

import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

// const DEFAULT_TOKEN_BALANCE = '1000000000000';
const DEFAULT_TOKEN_TOTAL_AMOUNT = '10000000000000000000000';
const DEFAULT_TOKEN_EARNED_INTEREST = '1000000000000';
const DEFAULT_TOKEN_EARNED_REWARDS = '1000000000000';

// const mockTokensBalance = jest.fn((currency: CurrencyExt, _id: AccountId) => new ChainBalance(currency, DEFAULT_TOKEN_BALANCE, DEFAULT_TOKEN_BALANCE));
// const mockTokensTotal = jest.fn(async (currency: CurrencyExt) => newMonetaryAmount(DEFAULT_TOKEN_TOTAL_AMOUNT, currency));
// const mockTokensSubscribeToBalance = jest.fn((currency: CurrencyExt, account, callback) => {
//   const balance = new ChainBalance(currency, DEFAULT_TOKEN_BALANCE, DEFAULT_TOKEN_BALANCE);
//   callback(account, balance);

//   return () => undefined;
// });

// mockGetBorrowPositionsOfAccount,
// mockGetCurrentBorrowBalance,
// mockGetCurrentCollateralBalance,
// mockGetLendPositionsOfAccount,
// mockGetLoanAssets

const positions = [
  {
    currency: WRAPPED_TOKEN,
    amount: newMonetaryAmount(DEFAULT_TOKEN_TOTAL_AMOUNT, WRAPPED_TOKEN),
    isCollateral: true,
    earnedInterest: newMonetaryAmount(DEFAULT_TOKEN_EARNED_INTEREST, WRAPPED_TOKEN),
    earnedReward: newMonetaryAmount(DEFAULT_TOKEN_EARNED_REWARDS, GOVERNANCE_TOKEN)
  }
];

const mockGetLendPositionsOfAccount = jest.fn().mockReturnValue(positions);
const mockGetBorrowPositionsOfAccount = jest.fn().mockReturnValue(positions);

export { mockGetBorrowPositionsOfAccount, mockGetLendPositionsOfAccount };
