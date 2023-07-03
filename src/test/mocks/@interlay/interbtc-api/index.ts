import '@testing-library/jest-dom';

import { InterBtcApi } from '@interlay/interbtc-api';
import { Interlay, Polkadot } from '@interlay/monetary-js';
import { AddressOrPair } from '@polkadot/api/types';
import { Signer } from '@polkadot/types/types';

import {
  MOCK_AMM,
  MOCK_TRANSACTION,
  mockApiCreateType,
  mockBtcRelayGetLatestBlockHeight,
  mockChainType,
  mockElectrsAPIGetLatestBlockHeight,
  mockFeeGetIssueFee,
  mockFeeGetIssueGriefingCollateralRate,
  mockGetCurrentActiveBlockNumber,
  mockGetCurrentBlockNumber,
  mockGetFutureBlockNumber,
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
import { mockGetForeignAssets } from './parachain/assetRegistry';
import { mockGetStakedBalance, mockVotingBalance } from './parachain/escrow';
import {
  mockBorrow,
  mockClaimAllSubsidyRewards,
  mockDisableAsCollateral,
  mockEnableAsCollateral,
  mockGetAccountSubsidyRewards,
  mockGetBorrowPositionsOfAccount,
  mockGetLendingStats,
  mockGetLendPositionsOfAccount,
  mockGetLendTokenExchangeRates,
  mockGetLendTokens,
  mockGetLoanAssets,
  mockLend,
  mockRepay,
  mockRepayAll,
  mockWithdraw,
  mockWithdrawAll
} from './parachain/loans';
import { mockClaimVesting, mockVestingSchedules } from './parachain/vesting';

const mockSetAccount = jest.fn((_account: AddressOrPair, _signer?: Signer) => undefined);

const mockCollateralCurrencies = [Polkadot, Interlay];

// To mock new lib methods extend this object.
const mockInterBtcApi: Partial<Record<keyof InterBtcApi, unknown>> = {
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
    on: jest.fn(),
    query: {
      vesting: {
        vestingSchedules: mockVestingSchedules as any
      },
      oracle: {
        aggregate: {
          keys: jest.fn().mockReturnValue([])
        }
      }
    },
    tx: {
      vesting: {
        claim: mockClaimVesting
      }
    }
  },
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
    getLendingStats: mockGetLendingStats,
    getLendTokenExchangeRates: mockGetLendTokenExchangeRates
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
    getStatusCode: mockSystemGetStatusCode,
    getFutureBlockNumber: mockGetFutureBlockNumber,
    getCurrentActiveBlockNumber: mockGetCurrentActiveBlockNumber,
    getCurrentBlockNumber: mockGetCurrentBlockNumber
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
