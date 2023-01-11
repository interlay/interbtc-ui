import { newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';

import { WRAPPED_TOKEN } from '@/config/relay-chains';

// ray test touch <
const MOCK_ISSUE_REQUEST_LIMITS = {
  singleVaultMaxIssuable: newMonetaryAmount('56527153', WRAPPED_TOKEN),
  totalMaxIssuable: newMonetaryAmount('493817337', WRAPPED_TOKEN)
};
// ray test touch >

const mockIssueGetDustValue = jest.fn(() => BitcoinAmount.zero());

// ray test touch <
const mockIssueGetRequestLimits = jest.fn(() => MOCK_ISSUE_REQUEST_LIMITS);
// ray test touch >
const mockIssueRequest = jest.fn();

export { MOCK_ISSUE_REQUEST_LIMITS, mockIssueGetDustValue, mockIssueGetRequestLimits, mockIssueRequest };
