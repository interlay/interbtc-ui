import '@testing-library/jest-dom';

import { InterBtcApi } from '@interlay/interbtc-api';
import { Interlay, Polkadot } from '@interlay/monetary-js';
import { AddressOrPair } from '@polkadot/api/types';
import { Signer } from '@polkadot/types/types';

import {
  MOCK_AMM,
  MOCK_API,
  MOCK_ESCROW,
  MOCK_LOANS,
  MOCK_SYSTEM,
  MOCK_TOKENS,
  MOCK_TRANSACTION,
  mockBtcRelayGetLatestBlockHeight,
  mockElectrsAPIGetLatestBlockHeight,
  mockFeeGetIssueFee,
  mockFeeGetIssueGriefingCollateralRate,
  mockGetStableBitcoinConfirmations,
  mockGetStableParachainConfirmations,
  mockIssueGetDustValue,
  mockIssueGetRequestLimits,
  mockIssueRequest,
  mockOracleGetExchangeRate,
  mockRedeemBurn,
  mockRedeemGetBurnExchangeRate,
  mockRedeemGetCurrentInclusionFee,
  mockRedeemGetDustValue,
  mockRedeemGetFeeRate,
  mockRedeemGetMaxBurnableTokens,
  mockRedeemGetPremiumRedeemFeeRate,
  mockRedeemRequest,
  mockVaultsGet,
  mockVaultsGetPremiumRedeemVaults,
  mockVaultsGetVaultsWithIssuableTokens,
  mockVaultsGetVaultsWithRedeemableTokens
} from './parachain';
import { mockGetForeignAssets } from './parachain/assetRegistry';

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
  fee: {
    getIssueFee: mockFeeGetIssueFee,
    getIssueGriefingCollateralRate: mockFeeGetIssueGriefingCollateralRate
  },
  issue: {
    getDustValue: mockIssueGetDustValue,
    getRequestLimits: mockIssueGetRequestLimits,
    request: mockIssueRequest
  },
  loans: MOCK_LOANS.MODULE,
  oracle: {
    getExchangeRate: mockOracleGetExchangeRate
  },
  redeem: {
    getMaxBurnableTokens: mockRedeemGetMaxBurnableTokens,
    getBurnExchangeRate: mockRedeemGetBurnExchangeRate,
    burn: mockRedeemBurn,
    getDustValue: mockRedeemGetDustValue,
    getPremiumRedeemFeeRate: mockRedeemGetPremiumRedeemFeeRate,
    getFeeRate: mockRedeemGetFeeRate,
    getCurrentInclusionFee: mockRedeemGetCurrentInclusionFee,
    request: mockRedeemRequest
  },
  system: MOCK_SYSTEM.MODULE,
  tokens: MOCK_TOKENS.MODULE,
  vaults: {
    get: mockVaultsGet,
    getVaultsWithIssuableTokens: mockVaultsGetVaultsWithIssuableTokens,
    getPremiumRedeemVaults: mockVaultsGetPremiumRedeemVaults,
    getVaultsWithRedeemableTokens: mockVaultsGetVaultsWithRedeemableTokens
  },
  amm: MOCK_AMM.MODULE,
  escrow: MOCK_ESCROW.MODULE,
  transaction: MOCK_TRANSACTION.MODULE
};

jest.mock('@interlay/interbtc-api', () => {
  const actualInterBtcApi = jest.requireActual('@interlay/interbtc-api');

  return {
    ...actualInterBtcApi,
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
