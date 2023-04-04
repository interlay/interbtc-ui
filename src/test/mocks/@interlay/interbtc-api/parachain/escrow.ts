import '@testing-library/jest-dom';

import { newMonetaryAmount } from '@interlay/interbtc-api';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';

const DEFAULT_STAKED_AMOUNT = newMonetaryAmount(10, GOVERNANCE_TOKEN, true);

const DEFAULT_STAKED_BALANCE = { amount: DEFAULT_STAKED_AMOUNT, endBlock: 0 };

const EMPTY_STAKED_BALANCE = { amount: newMonetaryAmount(0, GOVERNANCE_TOKEN), endBlock: 0 };

const mockGetStakedBalance = jest.fn().mockResolvedValue(DEFAULT_STAKED_BALANCE);

const DEFAULT_VOTING_BALANCE = newMonetaryAmount(10, GOVERNANCE_TOKEN, true);

const mockVotingBalance = jest.fn().mockResolvedValue(DEFAULT_VOTING_BALANCE);

export {
  DEFAULT_STAKED_BALANCE,
  DEFAULT_VOTING_BALANCE,
  EMPTY_STAKED_BALANCE,
  mockGetStakedBalance,
  mockVotingBalance
};
