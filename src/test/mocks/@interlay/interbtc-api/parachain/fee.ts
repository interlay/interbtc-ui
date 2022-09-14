import Big from "big.js";

const DEFAULT_ISSUE_FEE = new Big(0.005);
const DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE = new Big(0.00005);


const mockFeeGetIssueFee = jest.fn(() => DEFAULT_ISSUE_FEE);
const mockFeeGetIssueGriefingCollateralRate = jest.fn(() => DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE);

export { mockFeeGetIssueFee, mockFeeGetIssueGriefingCollateralRate }