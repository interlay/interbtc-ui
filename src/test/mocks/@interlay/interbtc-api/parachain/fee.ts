import Big from 'big.js';

// ray test touch <<
import { ISSUE_BRIDGE_FEE_RATE } from '@/config/parachain';
// ray test touch >>

const DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE = new Big(0.00005);

const mockFeeGetIssueFee = jest.fn(() => new Big(ISSUE_BRIDGE_FEE_RATE));
const mockFeeGetIssueGriefingCollateralRate = jest.fn(() => DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE);

export { mockFeeGetIssueFee, mockFeeGetIssueGriefingCollateralRate };
