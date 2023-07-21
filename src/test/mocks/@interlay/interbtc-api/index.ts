import '@testing-library/jest-dom';

import { InterBtcApi } from '@interlay/interbtc-api';
import { Interlay, Polkadot } from '@interlay/monetary-js';
import { AddressOrPair } from '@polkadot/api/types';
import { Signer } from '@polkadot/types/types';

import {
  MOCK_AMM,
  MOCK_API,
  MOCK_FEE,
  MOCK_ISSUE,
  MOCK_LOANS,
  MOCK_SYSTEM,
  MOCK_TOKENS,
  MOCK_TRANSACTION,
  MOCK_VAULTS,
  mockBtcRelayGetLatestBlockHeight,
  mockElectrsAPIGetLatestBlockHeight,
  mockGetStableBitcoinConfirmations,
  mockGetStableParachainConfirmations,
  mockOracleGetExchangeRate
} from './parachain';
import { mockGetForeignAssets } from './parachain/assetRegistry';
import { mockGetStakedBalance, mockVotingBalance } from './parachain/escrow';

const mockSetAccount = jest.fn((_account: AddressOrPair, _signer?: Signer) => undefined);

const mockCollateralCurrencies = [Polkadot, Interlay];

// To mock new lib methods extend this object.
const mockInterBtcApi: Partial<Record<keyof InterBtcApi, unknown>> = {
  removeAccount: jest.fn(),
  setAccount: mockSetAccount,
  api: MOCK_API.PROMISE,
  assetRegistry: {
    getForeignAssets: mockGetForeignAssets
  },
  btcRelay: {
    getLatestBlockHeight: mockBtcRelayGetLatestBlockHeight,
    getStableParachainConfirmations: mockGetStableParachainConfirmations,
    getStableBitcoinConfirmations: mockGetStableBitcoinConfirmations
  },
  electrsAPI: { getLatestBlockHeight: mockElectrsAPIGetLatestBlockHeight },
  fee: MOCK_FEE.MODULE,
  issue: MOCK_ISSUE.MODULE,
  loans: MOCK_LOANS.MODULE,
  oracle: {
    getExchangeRate: mockOracleGetExchangeRate
  },
  system: MOCK_SYSTEM.MODULE,
  tokens: MOCK_TOKENS.MODULE,
  vaults: MOCK_VAULTS.MODULE,
  amm: MOCK_AMM.MODULE,
  escrow: {
    getStakedBalance: mockGetStakedBalance,
    votingBalance: mockVotingBalance
  },
  transaction: MOCK_TRANSACTION.MODULE
};

jest.mock('@interlay/interbtc-api', () => {
  const actualInterBtcApi = jest.requireActual('@interlay/interbtc-api');

  return {
    ...actualInterBtcApi,
    getIssueRequestsFromExtrinsicResult: jest.fn(),
    currencyIdToMonetaryCurrency: jest.fn(),
    newAccountId: jest.fn().mockReturnValue('a3aTRC4zs1djutYS9QuZSB3XmfRgNzFfyRtbZKaoQyv67Yzcc'),
    getCollateralCurrencies: jest.fn(() => mockCollateralCurrencies),
    createInterBtcApi: jest.fn((..._argv) => mockInterBtcApi),
    FaucetClient: jest.fn().mockImplementation(() => ({ fundAccount: jest.fn() })),
    newExtrinsicStatus: jest.fn()
  };
});

export * from './parachain';
export { mockInterBtcApi, mockSetAccount };
