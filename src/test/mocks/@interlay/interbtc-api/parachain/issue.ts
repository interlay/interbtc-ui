import { newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';

import { DEFAULT_ISSUE_DUST_AMOUNT } from '@/config/parachain';
import { WRAPPED_TOKEN } from '@/config/relay-chains';

const mockIssueGetDustValue = jest.fn(() => new BitcoinAmount(DEFAULT_ISSUE_DUST_AMOUNT));

const mockIssueGetRequestLimits = jest.fn(() => ({
  singleVaultMaxIssuable: newMonetaryAmount('56527153', WRAPPED_TOKEN),
  totalMaxIssuable: newMonetaryAmount('493817337', WRAPPED_TOKEN)
}));

const mockIssueRequest = jest.fn();

export { mockIssueGetDustValue, mockIssueGetRequestLimits, mockIssueRequest };
