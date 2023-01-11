import { newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';

import { WRAPPED_TOKEN } from '@/config/relay-chains';

const MOCK_ISSUE_REQUEST_LIMITS = {
  singleVaultMaxIssuable: newMonetaryAmount('56527153', WRAPPED_TOKEN),
  totalMaxIssuable: newMonetaryAmount('493817337', WRAPPED_TOKEN)
};

const mockIssueGetDustValue = jest.fn(() => BitcoinAmount.zero());

const mockIssueGetRequestLimits = jest.fn(() => MOCK_ISSUE_REQUEST_LIMITS);

const mockIssueRequest = jest.fn();

export { MOCK_ISSUE_REQUEST_LIMITS, mockIssueGetDustValue, mockIssueGetRequestLimits, mockIssueRequest };
