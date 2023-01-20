import { BitcoinAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import {
  DEFAULT_ISSUE_BRIDGE_FEE_RATE,
  DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE,
  DEFAULT_REDEEM_BRIDGE_FEE_RATE
} from '@/config/parachain';

const MOCK_ISSUE_BRIDGE_FEE_RATE = new Big(DEFAULT_ISSUE_BRIDGE_FEE_RATE);

const MOCK_ISSUE_GRIEFING_COLLATERAL_RATE = new Big(DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE);

const MOCK_REDEEM_BRIDGE_FEE_RATE = new Big(DEFAULT_REDEEM_BRIDGE_FEE_RATE);

const MOCK_REDEEM_CURRENT_INCLUSION_FEE = new BitcoinAmount(0.0000038);

const mockFeeGetIssueFee = jest.fn(() => MOCK_ISSUE_BRIDGE_FEE_RATE);

const mockFeeGetIssueGriefingCollateralRate = jest.fn(() => MOCK_ISSUE_GRIEFING_COLLATERAL_RATE);

const mockRedeemGetPremiumRedeemFeeRate = jest.fn(() => Big(0));

const mockRedeemGetFeeRate = jest.fn(() => MOCK_REDEEM_BRIDGE_FEE_RATE);

const mockRedeemGetCurrentInclusionFee = jest.fn(() => MOCK_REDEEM_CURRENT_INCLUSION_FEE);

export {
  MOCK_ISSUE_BRIDGE_FEE_RATE,
  MOCK_ISSUE_GRIEFING_COLLATERAL_RATE,
  MOCK_REDEEM_BRIDGE_FEE_RATE,
  MOCK_REDEEM_CURRENT_INCLUSION_FEE,
  mockFeeGetIssueFee,
  mockFeeGetIssueGriefingCollateralRate,
  mockRedeemGetCurrentInclusionFee,
  mockRedeemGetFeeRate,
  mockRedeemGetPremiumRedeemFeeRate
};
