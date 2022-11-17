import '@testing-library/jest-dom';

import { InterBtcApi } from '@interlay/interbtc-api';
import { Interlay, Polkadot } from '@interlay/monetary-js';
import { AddressOrPair } from '@polkadot/api/types';
import { Signer } from '@polkadot/types/types';

import {
  mockApiCreateType,
  mockBtcRelayGetLatestBlockHeight,
  mockChainType,
  mockElectrsAPIGetLatestBlockHeight,
  mockFeeGetIssueFee,
  mockFeeGetIssueGriefingCollateralRate,
  mockIssueGetDustValue,
  mockIssueGetRequestLimits,
  // ray test touch <
  mockIssueRequest,
  // ray test touch >
  mockOracleGetExchangeRate,
  mockRedeemBurn,
  mockRedeemGetBurnExchangeRate,
  mockRedeemGetMaxBurnableTokens,
  mockSystemChain,
  mockSystemGetStatusCode,
  mockTokensBalance,
  mockTokensSubscribeToBalance,
  mockTokensTotal,
  mockVaultsGet,
  mockVaultsGetVaultsWithIssuableTokens
} from './parachain';
import { mockGetForeignAssets } from './parachain/assetRegistry';
import { mockGetLendTokens } from './parachain/loans';

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const mockSetAccount = jest.fn((_account: AddressOrPair, _signer?: Signer) => undefined);

const mockCollateralCurrencies = [Polkadot, Interlay];

// To mock new lib methods extend this object.
const mockInterBtcApi: RecursivePartial<InterBtcApi> = {
  removeAccount: jest.fn(),
  setAccount: mockSetAccount,
  api: {
    createType: mockApiCreateType,
    rpc: {
      system: {
        chain: mockSystemChain,
        chainType: mockChainType
      }
    },
    on: jest.fn()
  },
  assetRegistry: {
    getForeignAssets: mockGetForeignAssets
  },
  btcRelay: { getLatestBlockHeight: mockBtcRelayGetLatestBlockHeight },
  electrsAPI: { getLatestBlockHeight: mockElectrsAPIGetLatestBlockHeight },
  fee: {
    getIssueFee: mockFeeGetIssueFee,
    getIssueGriefingCollateralRate: mockFeeGetIssueGriefingCollateralRate
  },
  issue: {
    getDustValue: mockIssueGetDustValue,
    getRequestLimits: mockIssueGetRequestLimits,
    // ray test touch <
    request: mockIssueRequest
    // ray test touch >
  },
  loans: {
    getLendTokens: mockGetLendTokens
  },
  oracle: {
    getExchangeRate: mockOracleGetExchangeRate
  },
  redeem: {
    getMaxBurnableTokens: mockRedeemGetMaxBurnableTokens,
    getBurnExchangeRate: mockRedeemGetBurnExchangeRate,
    burn: mockRedeemBurn
  },
  system: {
    getStatusCode: mockSystemGetStatusCode
  },
  tokens: {
    balance: mockTokensBalance,
    total: mockTokensTotal,
    subscribeToBalance: mockTokensSubscribeToBalance
  },
  vaults: {
    get: mockVaultsGet,
    getVaultsWithIssuableTokens: mockVaultsGetVaultsWithIssuableTokens
  }
};

jest.mock('@interlay/interbtc-api', () => {
  const actualInterBtcApi = jest.requireActual('@interlay/interbtc-api');

  return {
    ...actualInterBtcApi,
    newAccountId: jest.fn().mockReturnValue('a3bS5ufTQYaWkWtiKH9urgnC81QWFArJz4TJCFXiBCj8C1oUm'),
    getCollateralCurrencies: jest.fn(() => mockCollateralCurrencies),
    createInterBtcApi: jest.fn((..._argv) => mockInterBtcApi as InterBtcApi)
  };
});

export { mockInterBtcApi, mockSetAccount };
export * from './parachain';
