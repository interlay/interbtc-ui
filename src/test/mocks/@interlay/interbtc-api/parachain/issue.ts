import { IssueAPI, newMonetaryAmount } from '@interlay/interbtc-api';
import { IssueLimits } from '@interlay/interbtc-api/build/src/parachain/issue';

import { WRAPPED_TOKEN } from '@/config/relay-chains';

import { EXTRINSIC_DATA } from '../extrinsic';

const REQUEST_LIMIT: Record<'EMPTY' | 'FULL', IssueLimits> = {
  EMPTY: {
    singleVaultMaxIssuable: newMonetaryAmount(0, WRAPPED_TOKEN),
    totalMaxIssuable: newMonetaryAmount(0, WRAPPED_TOKEN)
  },
  FULL: {
    singleVaultMaxIssuable: newMonetaryAmount(1, WRAPPED_TOKEN, true),
    totalMaxIssuable: newMonetaryAmount(2, WRAPPED_TOKEN, true)
  }
};

const DUST_VALUE = newMonetaryAmount(0.0001, WRAPPED_TOKEN);

const DATA = {
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
