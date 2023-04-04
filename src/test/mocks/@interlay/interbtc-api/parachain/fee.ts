import { BitcoinAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import {
  DEFAULT_ISSUE_BRIDGE_FEE_RATE,
  DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE,
  DEFAULT_REDEEM_BRIDGE_FEE_RATE
} from '@/config/parachain';

const mockFeeGetIssueFee = jest.fn(() => new Big(DEFAULT_ISSUE_BRIDGE_FEE_RATE));

const mockFeeGetIssueGriefingCollateralRate = jest.fn(() => new Big(DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE));

const mockRedeemGetPremiumRedeemFeeRate = jest.fn(() => Big(0));

const mockRedeemGetFeeRate = jest.fn(() => new Big(DEFAULT_REDEEM_BRIDGE_FEE_RATE));

const mockRedeemGetCurrentInclusionFee = jest.fn(() => new BitcoinAmount(0.0000038));

export {
  mockFeeGetIssueFee,
  mockFeeGetIssueGriefingCollateralRate,
  mockRedeemGetCurrentInclusionFee,
  mockRedeemGetFeeRate,
  mockRedeemGetPremiumRedeemFeeRate
};
