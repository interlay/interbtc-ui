import { newMonetaryAmount } from '@interlay/interbtc-api';
import Big from 'big.js';

import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

const DEFAULT_TOKEN_TOTAL_AMOUNT = '10000000000000000000000';
const DEFAULT_TOKEN_EARNED_INTEREST = '1000000000000';
const DEFAULT_TOKEN_EARNED_REWARDS = '1000000000000';

const mockPositions = [
  {
    currency: WRAPPED_TOKEN,
    amount: newMonetaryAmount(DEFAULT_TOKEN_TOTAL_AMOUNT, WRAPPED_TOKEN),
    isCollateral: true,
    earnedInterest: newMonetaryAmount(DEFAULT_TOKEN_EARNED_INTEREST, WRAPPED_TOKEN),
    earnedReward: newMonetaryAmount(DEFAULT_TOKEN_EARNED_REWARDS, GOVERNANCE_TOKEN)
  }
];

const assets = {
  KBTC: {
    currency: WRAPPED_TOKEN,
    lendApy: new Big('10.2'),
    borrowApy: new Big('13.223'),
    totalLiquidity: newMonetaryAmount(DEFAULT_TOKEN_TOTAL_AMOUNT, WRAPPED_TOKEN),
    lendReward: {
      currency: GOVERNANCE_TOKEN,
      apy: new Big('23.21')
    },
    borrowReward: null,
    availableCapacity: newMonetaryAmount(DEFAULT_TOKEN_TOTAL_AMOUNT, WRAPPED_TOKEN),
    liquidationThreshold: new Big('80')
  },
  KINT: {
    currency: GOVERNANCE_TOKEN,
    lendApy: new Big('40.13'),
    borrowApy: new Big('53.91'),
    totalLiquidity: newMonetaryAmount(DEFAULT_TOKEN_EARNED_REWARDS, GOVERNANCE_TOKEN),
    lendReward: null,
    borrowReward: null,
    availableCapacity: newMonetaryAmount(DEFAULT_TOKEN_EARNED_REWARDS, GOVERNANCE_TOKEN),
    liquidationThreshold: new Big('80')
  }
};

const mockGetLendPositionsOfAccount = jest.fn().mockReturnValue([]);
const mockGetBorrowPositionsOfAccount = jest.fn().mockReturnValue([]);
const mockGetLoanAssets = jest.fn().mockReturnValue(assets);

export { mockGetBorrowPositionsOfAccount, mockGetLendPositionsOfAccount, mockGetLoanAssets, mockPositions };
