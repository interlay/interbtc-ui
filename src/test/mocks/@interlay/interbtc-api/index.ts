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
  mockSystemChain,
  mockSystemGetStatusCode,
  mockTokensBalance,
  mockTokensSubscribeToBalance,
  mockTokensTotal,
  mockVaultsGet,
  mockVaultsGetPremiumRedeemVaults,
  mockVaultsGetVaultsWithIssuableTokens,
  mockVaultsGetVaultsWithRedeemableTokens
} from './parachain';
import {
  mockGetClaimableFarmingRewards,
  mockGetLiquidityPools,
  mockGetLiquidityProvidedByAccount
} from './parachain/amm';
import { mockGetForeignAssets } from './parachain/assetRegistry';
import {
  mockBorrow,
  mockClaimAllSubsidyRewards,
  mockDisableAsCollateral,
  mockEnableAsCollateral,
  mockGetAccountSubsidyRewards,
  mockGetBorrowPositionsOfAccount,
  mockGetLendingStats,
  mockGetLendPositionsOfAccount,
  mockGetLendTokens,
  mockGetLoanAssets,
  mockLend,
  mockRepay,
  mockRepayAll,
  mockWithdraw,
  mockWithdrawAll
} from './parachain/loans';

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
    request: mockIssueRequest
  },
  loans: {
    getLendTokens: mockGetLendTokens,
    getLendPositionsOfAccount: mockGetLendPositionsOfAccount,
    getBorrowPositionsOfAccount: mockGetBorrowPositionsOfAccount,
    getLoanAssets: mockGetLoanAssets,
    getAccruedRewardsOfAccount: mockGetAccountSubsidyRewards,
    lend: mockLend,
    withdraw: mockWithdraw,
    withdrawAll: mockWithdrawAll,
    borrow: mockBorrow,
    repay: mockRepay,
    repayAll: mockRepayAll,
    enableAsCollateral: mockEnableAsCollateral,
    disableAsCollateral: mockDisableAsCollateral,
    claimAllSubsidyRewards: mockClaimAllSubsidyRewards,
    getLendingStats: mockGetLendingStats
  },
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
    getVaultsWithIssuableTokens: mockVaultsGetVaultsWithIssuableTokens,
    getPremiumRedeemVaults: mockVaultsGetPremiumRedeemVaults,
    getVaultsWithRedeemableTokens: mockVaultsGetVaultsWithRedeemableTokens
  },
  amm: {
    getLpTokens: jest.fn().mockResolvedValue([]),
    getLiquidityPools: mockGetLiquidityPools,
    getLiquidityProvidedByAccount: mockGetLiquidityProvidedByAccount,
    getClaimableFarmingRewards: mockGetClaimableFarmingRewards
  }
};

jest.mock('@interlay/interbtc-api', () => {
  const actualInterBtcApi = jest.requireActual('@interlay/interbtc-api');

  return {
    ...actualInterBtcApi,
    currencyIdToMonetaryCurrency: jest.fn(),
    newAccountId: jest.fn().mockReturnValue('a3bS5ufTQYaWkWtiKH9urgnC81QWFArJz4TJCFXiBCj8C1oUm'),
    getCollateralCurrencies: jest.fn(() => mockCollateralCurrencies),
    createInterBtcApi: jest.fn((..._argv) => mockInterBtcApi as InterBtcApi)
  };
});

export { mockInterBtcApi, mockSetAccount };
export * from './parachain';
