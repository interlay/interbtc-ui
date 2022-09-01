import '@testing-library/jest-dom';
import '../mockFactory';

import * as interBtcApi from '@interlay/interbtc-api';
import { atomicToBaseAmount, ChainBalance, InterBtcApi, newMonetaryAmount } from '@interlay/interbtc-api';
import { ExchangeRate } from '@interlay/monetary-js';
import { Bitcoin, BitcoinAmount } from '@interlay/monetary-js';
import { AddressOrPair, Signer } from '@polkadot/api/types';
import { MockProvider } from '@polkadot/rpc-provider/mock';
import Big from 'big.js';
import { mocked } from 'ts-jest/utils';

import App from '@/App';

import { WRAPPED_TOKEN } from '../../config/relay-chains';
import { act, cleanup, render, screen, userEvent } from '../test-utils';

afterEach(cleanup);

const DEFAULT_ADDRESS = '5DHdoCL6YPvK5s7N31CdVb3o5bkVGJBCmBZkhXdYzGke5TTd';

const DEFAULT_BTC_BLOCK_HEIGHT = 1000;
const DEFAULT_TOKEN_AMOUNT = '1000000000000';

const SYSTEM_STATUS_RUNNING = { isRunning: true };

const DEFAULT_ISSUE_FEE = new Big(0.005);
const DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE = new Big(0.00005);

const DEFAULT_EXCHANGE_RATE = '1000000';

const DEFAULT_MAX_BURNABLE_TOKENS = '100000000'; // 1 BTC
const DEFAULT_BURN_EXCHANGE_RATE = '150000';

const DEFAULT_REQUEST_LIMITS = {
  singleVaultMaxIssuable: newMonetaryAmount('56527153', WRAPPED_TOKEN), // {
  totalMaxIssuable: newMonetaryAmount('493817337', WRAPPED_TOKEN)
};

// TODO: Extend with all the data needed for Vaults page when needed.
const DEFAULT_VAULT_OBJECT = (accountId, collateralCurrency: interBtcApi.CollateralCurrencyExt) => ({
  backingCollateral: newMonetaryAmount(DEFAULT_TOKEN_AMOUNT, collateralCurrency)
});

// TODO: Split into separate files, cleanup.
// These functions can be imported into tests and modified by calling [fn].mockImplementation method.
const mockTokensTotal = jest.fn(async (currency: interBtcApi.CurrencyExt) =>
  newMonetaryAmount(DEFAULT_TOKEN_AMOUNT, currency)
);
const mockTokensSubscribeToBalance = jest.fn((currency: interBtcApi.CurrencyExt, account, callback) => {
  const balance = new ChainBalance(currency, DEFAULT_TOKEN_AMOUNT, DEFAULT_TOKEN_AMOUNT);
  callback(account, balance);

  return () => undefined;
});
const mockElectrsAPIGetLatestBlockHeight = jest.fn(() => DEFAULT_BTC_BLOCK_HEIGHT);
const mockBtcRelayGetLatestBlockHeight = jest.fn(() => DEFAULT_BTC_BLOCK_HEIGHT);
// Change to isError or isShutdown in order to simulate parachain being down.
const mockSystemGetStatusCode = jest.fn(() => SYSTEM_STATUS_RUNNING);
const mockFeeGetIssueFee = jest.fn(() => DEFAULT_ISSUE_FEE);
const mockFeeGetIssueGriefingCollateralRate = jest.fn(() => DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE);
const mockOracleGetExchangeRate = jest.fn(
  (currency: interBtcApi.CurrencyExt) => new ExchangeRate(Bitcoin, currency, Big(DEFAULT_EXCHANGE_RATE))
);
const mockIssueGetDustValue = jest.fn(() => BitcoinAmount.zero());
const mockIssueGetRequestLimits = jest.fn(() => DEFAULT_REQUEST_LIMITS);
const mockRedeemGetMaxBurnable = jest.fn((_currency: interBtcApi.CurrencyExt) =>
  newMonetaryAmount(DEFAULT_MAX_BURNABLE_TOKENS, WRAPPED_TOKEN)
);
const mockRedeemGetBurnExchangeRate = jest.fn(
  (collateralCurrency: interBtcApi.CollateralCurrencyExt) =>
    new ExchangeRate(Bitcoin, collateralCurrency, Big(DEFAULT_BURN_EXCHANGE_RATE))
);
const mockRedeemBurn = jest.fn();
const mockApiCreateType = jest.fn(<T extends unknown>(type: string, data: T) => data);
const mockVaultsGet = jest.fn((accountId, currency) => DEFAULT_VAULT_OBJECT(accountId, currency));
const mockVaultsGetVaultsWithIssuableTokens = jest.fn(() => []);
const mockSetAccount = jest.fn((_account: AddressOrPair, _signer?: Signer) => undefined);

const mockedApiValue: RecursivePartial<InterBtcApi> = {
  btcRelay: { getLatestBlockHeight: mockBtcRelayGetLatestBlockHeight },
  tokens: {
    total: mockTokensTotal,
    subscribeToBalance: mockTokensSubscribeToBalance
  },
  electrsAPI: { getLatestBlockHeight: mockElectrsAPIGetLatestBlockHeight },
  system: {
    getStatusCode: mockSystemGetStatusCode
  },
  fee: {
    getIssueFee: mockFeeGetIssueFee,
    getIssueGriefingCollateralRate: mockFeeGetIssueGriefingCollateralRate
  },
  oracle: {
    getExchangeRate: mockOracleGetExchangeRate
  },
  issue: {
    getDustValue: mockIssueGetDustValue,
    getRequestLimits: mockIssueGetRequestLimits
  },
  redeem: {
    getMaxBurnableTokens: mockRedeemGetMaxBurnable,
    getBurnExchangeRate: mockRedeemGetBurnExchangeRate,
    burn: mockRedeemBurn
  },
  api: {
    createType: mockApiCreateType
  },
  vaults: {
    get: mockVaultsGet,
    getVaultsWithIssuableTokens: mockVaultsGetVaultsWithIssuableTokens
  },
  setAccount: mockSetAccount
};

const DEFAULT_PRICES = {
  bitcoin: { usd: 20306 },
  polkadot: { usd: 7.19 },
  'kintsugi-btc': { usd: 20128 },
  kusama: { usd: 48.74 },
  interlay: { usd: 0.057282 },
  kintsugi: { usd: 1.84 }
};

jest.mock('@polkadot/api', () => {
  const actualApi = jest.requireActual('@polkadot/api');

  return {
    ...actualApi,
    Keyring: function () {
      return { addFromUri: (_seed: string) => ({ address: DEFAULT_ADDRESS }) };
    }
  };
});

const DEFAULT_INJECTED_ACCOUNT = {
  address: DEFAULT_ADDRESS,
  meta: {
    genesisHash: '0x0',
    name: 'AUTO_TESTING_ACCOUNT',
    source: ''
  }
};

jest.mock('@polkadot/extension-dapp', () => ({
  web3Enable: jest.fn(() => []), // Must return empty array, so default account is chosen.
  web3Accounts: jest.fn(() => [DEFAULT_INJECTED_ACCOUNT])
}));

jest.mock('@/utils/hooks/api/use-get-prices', () => {
  return {
    useGetPrices: () => DEFAULT_PRICES
  };
});

const mockedApi = mocked(interBtcApi, true);

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

mockedApi.createInterBtcApi.mockResolvedValueOnce(mockedApiValue as InterBtcApi);

describe('Burn page', () => {
  beforeEach(async () => {
    // TODO: mock the lib, so there's liquidated vault
    // return from window.bridge.redeem.getMaxBurnableTokens() > 0
  });

  it('should display burn tab when there is liquidated vault', async () => {
    // mockedApi.createInterBtcApi.mockResolvedValueOnce(mockedApiValue as InterBtcApi);
    await act(async () => {
      render(<App />, { path: '/bridge?tab=burn' });
    });

    const burnTab = await screen.findByText('Burn');
    expect(burnTab).toBeVisible();
  });

  it('should burn the IBTC', async () => {
    // TODO: Move to its own __mocks__ file.
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn().mockReturnValue(null),
      unobserve: jest.fn().mockReturnValue(null),
      disconnect: jest.fn().mockReturnValue(null)
    });
    window.IntersectionObserver = mockIntersectionObserver;

    await act(async () => {
      render(<App />, { path: '/bridge?tab=burn' });
    });

    const burnTab = await screen.findByText('Burn');
    userEvent.click(burnTab);

    const amountToBurnInput = await screen.findByTestId('number-input');

    await act(async () => {
      userEvent.type(amountToBurnInput, '0.0001');
    });

    const submitButton = screen.getByRole('button', { name: 'Burn' });
    expect(submitButton).toBeEnabled();

    await act(async () => {
      userEvent.click(submitButton);
    });

    expect(mockRedeemBurn).toHaveBeenCalled();
  });

  it.todo('should display collateral $ value to be received higher than burned $ value');
});
