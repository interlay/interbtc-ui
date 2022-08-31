import '@testing-library/jest-dom';

import * as interBtcApi from '@interlay/interbtc-api';
import { atomicToBaseAmount, InterBtcApi, newMonetaryAmount } from '@interlay/interbtc-api';
import { ExchangeRate } from '@interlay/monetary-js';
import { Bitcoin, BitcoinAmount } from '@interlay/monetary-js';
import { AddressOrPair, Signer } from '@polkadot/api/types';
import * as polkadotExtensionDapp from '@polkadot/extension-dapp';
import { MockProvider } from '@polkadot/rpc-provider/mock';
import Big from 'big.js';
import { mocked } from 'ts-jest/utils';

import App from '@/App';

import { WRAPPED_TOKEN, WRAPPED_TOKEN_SYMBOL } from '../../config/relay-chains';
import { act, cleanup, render, screen, userEvent } from '../test-utils';

afterEach(cleanup);

const DEFAULT_ADDRESS = '5DHdoCL6YPvK5s7N31CdVb3o5bkVGJBCmBZkhXdYzGke5TTd';

const DEFAULT_BTC_BLOCK_HEIGHT = 1000;
const DEFAULT_TOKEN_AMOUNT = '1000000000000';

const SYSTEM_STATUS_RUNNING = { isRunning: true };

const DEFAULT_ISSUE_FEE = new Big(0.005);
const DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE = new Big(0.00005);

const DEFAULT_EXCHANGE_RATE = '1000000';

const DEFAULT_MAX_BURNABLE_TOKENS = atomicToBaseAmount('100000000', Bitcoin); // 1 BTC
const DEFAULT_BURN_EXCHANGE_RATE = '150000';

const DEFAULT_REQUEST_LIMITS = {
  singleVaultMaxIssuable: newMonetaryAmount('56527153', WRAPPED_TOKEN), // {
  totalMaxIssuable: newMonetaryAmount('493817337', WRAPPED_TOKEN)
};

// TODO: Extend with all the data needed for Vaults page when needed.
const DEFAULT_VAULT_OBJECT = (accountId, collateralCurrency: interBtcApi.CollateralCurrencyExt) => ({
  backingCollateral: newMonetaryAmount(Big(DEFAULT_TOKEN_AMOUNT), collateralCurrency)
});

const mockedApiValue: RecursivePartial<InterBtcApi> = {
  tokens: {
    total: async (currency: interBtcApi.CurrencyExt) => newMonetaryAmount(DEFAULT_TOKEN_AMOUNT, currency)
  },
  btcRelay: { getLatestBlockHeight: () => DEFAULT_BTC_BLOCK_HEIGHT },
  electrsAPI: { getLatestBlockHeight: () => DEFAULT_BTC_BLOCK_HEIGHT },
  system: {
    getStatusCode: () => SYSTEM_STATUS_RUNNING // Change to isError or isShutdown in order to simulate parachain being down.
  },
  fee: {
    getIssueFee: () => DEFAULT_ISSUE_FEE,
    getIssueGriefingCollateralRate: () => DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE
  },
  oracle: {
    getExchangeRate: (currency: interBtcApi.CurrencyExt) =>
      new ExchangeRate(Bitcoin, currency, Big(DEFAULT_EXCHANGE_RATE))
  },
  issue: {
    getDustValue: () => BitcoinAmount.zero(),
    getRequestLimits: () => DEFAULT_REQUEST_LIMITS
  },
  redeem: {
    getMaxBurnableTokens: (_currency: interBtcApi.CurrencyExt) =>
      newMonetaryAmount(DEFAULT_MAX_BURNABLE_TOKENS, WRAPPED_TOKEN),
    getBurnExchangeRate: (collateralCurrency: interBtcApi.CollateralCurrencyExt) =>
      new ExchangeRate(Bitcoin, collateralCurrency, Big(DEFAULT_BURN_EXCHANGE_RATE))
  },
  api: {
    createType: <T extends unknown>(type: string, data: T) => data
  },
  vaults: {
    get: (accountId, currency) => DEFAULT_VAULT_OBJECT(accountId, currency),
    getVaultsWithIssuableTokens: () => []
  },
  setAccount: (_account: AddressOrPair, _signer?: Signer) => undefined
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
      return { addFromUri: (_seed: string) => DEFAULT_ADDRESS };
    }
  };
});

jest.mock('@polkadot/extension-dapp', () => ({
  web3Enable: jest.fn(() => [])
}));

jest.mock('@interlay/interbtc-api', () => {
  const actualInterBtcApi = jest.requireActual('@interlay/interbtc-api');

  return {
    ...actualInterBtcApi,
    createInterBtcApi: jest.fn(async (..._argv) => mockedApiValue as InterBtcApi)
  };
});

jest.mock('@/utils/hooks/api/use-get-prices', () => {
  return {
    useGetPrices: () => DEFAULT_PRICES
  };
});
const mockedApi = mocked(interBtcApi);

const mockProvider = () => {
  const registry = interBtcApi.createAPIRegistry();
  return new MockProvider(registry);
};

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

// Replace provider with mock provider to not connect
// mockedApi.createInterBtcApi.mockImplementation(async (..._) => mockedApiValue as InterBtcApi);

describe('Burn page', () => {
  beforeEach(async () => {
    // TODO: mock the lib, so there's liquidated vault
    // return from window.bridge.redeem.getMaxBurnableTokens() > 0
  });

  it('should display burn tab when there is liquidated vault', async () => {
    await act(async () => {
      render(<App />, { path: '/bridge?tab=burn' });
      await new Promise((r) => setTimeout(r, 2000));
    });
    await screen.findByText('Burn');
    const burnTab = screen.getByText('Burn');
    expect(burnTab).toBeVisible();
  });

  it('should burn the IBTC', async () => {
    await act(async () => {
      render(<App />, { path: '/bridge?tab=burn' });
      await new Promise((r) => setTimeout(r, 2000));
    });

    const burnTab = await screen.findByText('Burn');
    userEvent.click(burnTab);

    const amountToBurnInput = await screen.findByTestId('number-input');
    userEvent.type(amountToBurnInput, '0.0001');

    const submitButton = screen.getByRole('button', { name: 'Burn' });
    // TODO: set account globally, so it's possible to fake-sign transactions
  });

  it.todo('should display collateral $ value to be received higher than burned $ value');
});
