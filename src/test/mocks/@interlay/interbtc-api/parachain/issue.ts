import { IssueAPI, newMonetaryAmount } from '@interlay/interbtc-api';
import { IssueLimits } from '@interlay/interbtc-api/build/src/parachain/issue';
import { BitcoinAmount, Currency, MonetaryAmount } from '@interlay/monetary-js';

import { WRAPPED_TOKEN } from '@/config/relay-chains';

import { EXTRINSIC_DATA } from '../extrinsic';

const ISSUE_AMOUNTS: Record<'EMPTY' | 'HALF' | 'FULL', MonetaryAmount<Currency>> = {
  EMPTY: new BitcoinAmount(0),
  HALF: new BitcoinAmount(0.5),
  FULL: new BitcoinAmount(1)
};

const REQUEST_LIMIT: Record<'EMPTY' | 'FULL', IssueLimits> = {
  EMPTY: {
    singleVaultMaxIssuable: ISSUE_AMOUNTS.EMPTY,
    totalMaxIssuable: ISSUE_AMOUNTS.EMPTY
  },
  FULL: {
    singleVaultMaxIssuable: ISSUE_AMOUNTS.FULL,
    totalMaxIssuable: ISSUE_AMOUNTS.FULL.add(ISSUE_AMOUNTS.HALF)
  }
};

const DUST_VALUE = newMonetaryAmount(0.0001, WRAPPED_TOKEN);

const DATA = {
  ISSUE_AMOUNTS,
  REQUEST_LIMIT,
  DUST_VALUE
};

const MODULE: Record<keyof IssueAPI, jest.Mock<any, any>> = {
  getRequestLimits: jest.fn().mockResolvedValue(REQUEST_LIMIT.FULL),
  getDustValue: jest.fn().mockResolvedValue(DUST_VALUE),
  getFeeRate: jest.fn(),
  getFeesToPay: jest.fn(),
  getIssuePeriod: jest.fn(),
  getRequestById: jest.fn(),
  getRequestsByIds: jest.fn(),
  getVaultIssuableAmount: jest.fn(),
  setIssuePeriod: jest.fn(),
  cancel: jest.fn(),
  execute: jest.fn(),
  list: jest.fn(),
  request: jest.fn().mockResolvedValue(EXTRINSIC_DATA),
  requestAdvanced: jest.fn(),
  buildCancelIssueExtrinsic: jest.fn(),
  buildExecuteIssueExtrinsic: jest.fn(),
  buildRequestIssueExtrinsic: jest.fn()
};

const MOCK_ISSUE = {
  DATA,
  MODULE
};

export { MOCK_ISSUE };
