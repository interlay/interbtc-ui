import { BitcoinAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { ISSUE_BRIDGE_FEE_RATE } from '@/config/parachain';
import { REDEEM_BRIDGE_FEE_RATE } from '@/config/parachain';

const DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE = new Big(0.00005);

const CURRENT_INCLUSION_FEE = new BitcoinAmount(0.0000038);

const mockFeeGetIssueFee = jest.fn(() => new Big(ISSUE_BRIDGE_FEE_RATE));

const mockFeeGetIssueGriefingCollateralRate = jest.fn(() => DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE);

const mockRedeemGetPremiumRedeemFeeRate = jest.fn(() => Big(0));

const mockRedeemGetFeeRate = jest.fn(() => Big(REDEEM_BRIDGE_FEE_RATE));

const mockRedeemGetCurrentInclusionFee = jest.fn(() => CURRENT_INCLUSION_FEE);

export {
  CURRENT_INCLUSION_FEE,
  mockFeeGetIssueFee,
  mockFeeGetIssueGriefingCollateralRate,
  mockRedeemGetCurrentInclusionFee,
  mockRedeemGetFeeRate,
  mockRedeemGetPremiumRedeemFeeRate
};
