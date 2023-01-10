import { BitcoinAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { ISSUE_BRIDGE_FEE_RATE, ISSUE_GRIEFING_COLLATERAL_RATE, REDEEM_BRIDGE_FEE_RATE } from '@/config/parachain';

// ray test touch <<
const MOCK_ISSUE_BRIDGE_FEE_RATE = new Big(ISSUE_BRIDGE_FEE_RATE);

const MOCK_ISSUE_GRIEFING_COLLATERAL_RATE = new Big(ISSUE_GRIEFING_COLLATERAL_RATE);

const MOCK_REDEEM_BRIDGE_FEE_RATE = new Big(REDEEM_BRIDGE_FEE_RATE);
// ray test touch >>

const MOCK_REDEEM_CURRENT_INCLUSION_FEE = new BitcoinAmount(0.0000038);

const mockFeeGetIssueFee = jest.fn(() => MOCK_ISSUE_BRIDGE_FEE_RATE);

const mockFeeGetIssueGriefingCollateralRate = jest.fn(() => MOCK_ISSUE_GRIEFING_COLLATERAL_RATE);

const mockRedeemGetPremiumRedeemFeeRate = jest.fn(() => Big(0));

const mockRedeemGetFeeRate = jest.fn(() => MOCK_REDEEM_BRIDGE_FEE_RATE);

const mockRedeemGetCurrentInclusionFee = jest.fn(() => MOCK_REDEEM_CURRENT_INCLUSION_FEE);

export {
  // ray test touch <<
  MOCK_ISSUE_BRIDGE_FEE_RATE,
  MOCK_ISSUE_GRIEFING_COLLATERAL_RATE,
  MOCK_REDEEM_BRIDGE_FEE_RATE,
  // ray test touch >>
  MOCK_REDEEM_CURRENT_INCLUSION_FEE,
  mockFeeGetIssueFee,
  mockFeeGetIssueGriefingCollateralRate,
  mockRedeemGetCurrentInclusionFee,
  mockRedeemGetFeeRate,
  mockRedeemGetPremiumRedeemFeeRate
};
