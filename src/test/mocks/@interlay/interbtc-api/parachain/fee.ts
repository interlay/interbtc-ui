import Big from 'big.js';

import { ISSUE_BRIDGE_FEE_RATE } from '@/config/parachain';

const DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE = new Big(0.00005);

const mockFeeGetIssueFee = jest.fn(() => new Big(ISSUE_BRIDGE_FEE_RATE));

const mockFeeGetIssueGriefingCollateralRate = jest.fn(() => DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE);

// ray test touch <<
// ray test touch >>

export { mockFeeGetIssueFee, mockFeeGetIssueGriefingCollateralRate };
