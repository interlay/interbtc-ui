import { newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';

import { DEFAULT_ISSUE_DUST_AMOUNT } from '@/config/parachain';
import { WRAPPED_TOKEN } from '@/config/relay-chains';

const mockIssueGetDustValue = jest.fn(() => new BitcoinAmount(DEFAULT_ISSUE_DUST_AMOUNT));

const mockIssueGetRequestLimits = jest.fn(() => ({
  singleVaultMaxIssuable: newMonetaryAmount(0.56527153, WRAPPED_TOKEN, true),
  totalMaxIssuable: newMonetaryAmount(4.93817337, WRAPPED_TOKEN, true)
}));

const mockIssueRequest = jest.fn();

export { mockIssueGetDustValue, mockIssueGetRequestLimits, mockIssueRequest };
