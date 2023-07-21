import { FeeAPI } from '@interlay/interbtc-api';
import Big from 'big.js';

const ISSUE_FEE = new Big(1);

const GRIEFING_COLLATERAL_RATE = new Big(1);

const DATA = {
  ISSUE_FEE,
  GRIEFING_COLLATERAL_RATE
};

const MODULE: Record<keyof FeeAPI, jest.Mock<any, any>> = {
  calculateAPY: jest.fn(),
  getGriefingCollateral: jest.fn(),
  getIssueFee: jest.fn().mockResolvedValue(ISSUE_FEE),
  getIssueGriefingCollateralRate: jest.fn().mockResolvedValue(GRIEFING_COLLATERAL_RATE),
  getReplaceGriefingCollateralRate: jest.fn()
};

const MOCK_FEE = {
  DATA,
  MODULE
};

export { MOCK_FEE };
