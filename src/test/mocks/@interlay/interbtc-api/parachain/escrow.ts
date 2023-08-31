import '@testing-library/jest-dom';

import { CurrencyExt, EscrowAPI, newMonetaryAmount, StakedBalance } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { GOVERNANCE_TOKEN, STAKE_LOCK_TIME, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { convertWeeksToBlockNumbers } from '@/utils/helpers/staking';

import { EXTRINSIC_DATA } from '../extrinsic';
import { MOCK_SYSTEM } from './system';

const GOVERNANCE_AMOUNT = {
  EMPTY: {
    VALUE: '0',
    MONETARY: newMonetaryAmount(0, GOVERNANCE_TOKEN, true)
  },
  FULL: {
    VALUE: '100',
    MONETARY: newMonetaryAmount(100, GOVERNANCE_TOKEN, true)
  }
};

const VOTE_AMOUNT = {
  EMPTY: {
    VALUE: '0',
    MONETARY: newMonetaryAmount(0, VOTE_GOVERNANCE_TOKEN, true)
  },
  FULL: {
    VALUE: '100',
    MONETARY: newMonetaryAmount(100, VOTE_GOVERNANCE_TOKEN, true)
  }
};

const STAKED_BALANCE: Record<'EMPTY' | 'FULL' | 'FULL_LOCK_TIME', StakedBalance> = {
  EMPTY: { amount: GOVERNANCE_AMOUNT.EMPTY.MONETARY, endBlock: MOCK_SYSTEM.DATA.BLOCK_NUMBER.CURRENT },
  FULL: { amount: GOVERNANCE_AMOUNT.FULL.MONETARY, endBlock: MOCK_SYSTEM.DATA.BLOCK_NUMBER.CURRENT + 1 },
  FULL_LOCK_TIME: { amount: GOVERNANCE_AMOUNT.FULL.MONETARY, endBlock: convertWeeksToBlockNumbers(STAKE_LOCK_TIME.MAX) }
};

const REWARD_ESTIMATE: Record<'EMPTY' | 'FULL', { amount: MonetaryAmount<CurrencyExt>; apy: Big }> = {
  EMPTY: { apy: new Big(0), amount: GOVERNANCE_AMOUNT.EMPTY.MONETARY },
  FULL: { apy: new Big(10), amount: GOVERNANCE_AMOUNT.FULL.MONETARY }
};

const DATA = { GOVERNANCE_AMOUNT, STAKED_BALANCE };

const MODULE: Record<keyof EscrowAPI, jest.Mock<any, any>> = {
  getStakedBalance: jest.fn().mockResolvedValue(STAKED_BALANCE.FULL),
  votingBalance: jest.fn().mockResolvedValue(VOTE_AMOUNT.EMPTY.MONETARY),
  getRewardEstimate: jest.fn().mockResolvedValue(REWARD_ESTIMATE.FULL),
  totalVotingSupply: jest.fn().mockResolvedValue(GOVERNANCE_AMOUNT.FULL.MONETARY),
  getTotalStakedBalance: jest.fn().mockResolvedValue(GOVERNANCE_AMOUNT.FULL.MONETARY),
  getMaxPeriod: jest.fn(),
  getRewards: jest.fn().mockResolvedValue(GOVERNANCE_AMOUNT.FULL.MONETARY),
  getSpan: jest.fn(),
  // MUTATIONS
  createLock: jest.fn().mockReturnValue(EXTRINSIC_DATA),
  increaseAmount: jest.fn().mockReturnValue(EXTRINSIC_DATA),
  increaseUnlockHeight: jest.fn().mockReturnValue(EXTRINSIC_DATA),
  withdraw: jest.fn().mockReturnValue(EXTRINSIC_DATA),
  withdrawRewards: jest.fn().mockReturnValue(EXTRINSIC_DATA)
};

const MOCK_ESCROW = {
  DATA,
  MODULE
};

export { MOCK_ESCROW };
