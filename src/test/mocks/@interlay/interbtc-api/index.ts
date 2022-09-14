import '@testing-library/jest-dom';

import { InterBtcApi } from '@interlay/interbtc-api';
import { AddressOrPair } from '@polkadot/api/types';
import { Signer } from '@polkadot/types/types';

import { mockApiCreateType, mockBtcRelayGetLatestBlockHeight, mockElectrsAPIGetLatestBlockHeight, mockFeeGetIssueFee, mockFeeGetIssueGriefingCollateralRate, mockIssueGetDustValue, mockIssueGetRequestLimits, mockOracleGetExchangeRate, mockRedeemBurn, mockRedeemGetBurnExchangeRate, mockRedeemGetMaxBurnableTokens, mockSystemGetStatusCode, mockTokensSubscribeToBalance, mockTokensTotal, mockVaultsGet, mockVaultsGetVaultsWithIssuableTokens } from './parachain';

type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

const mockSetAccount = jest.fn((_account: AddressOrPair, _signer?: Signer) => undefined);

// To mock new lib methods extend this object.
const mockInterBtcApi: RecursivePartial<InterBtcApi> = {
    setAccount: mockSetAccount,
    api: {
        createType: mockApiCreateType
    },
    btcRelay: { getLatestBlockHeight: mockBtcRelayGetLatestBlockHeight },
    electrsAPI: { getLatestBlockHeight: mockElectrsAPIGetLatestBlockHeight },
    fee: {
        getIssueFee: mockFeeGetIssueFee,
        getIssueGriefingCollateralRate: mockFeeGetIssueGriefingCollateralRate
    },
    issue: {
        getDustValue: mockIssueGetDustValue,
        getRequestLimits: mockIssueGetRequestLimits
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
        createInterBtcApi: jest.fn((..._argv) => mockInterBtcApi as InterBtcApi)
    };
});

export { mockSetAccount }
export * from "./parachain";




