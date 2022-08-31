import '@testing-library/jest-dom';

import * as interBtcApi from '@interlay/interbtc-api';
import { atomicToBaseAmount, InterBtcApi, newMonetaryAmount } from '@interlay/interbtc-api';
import { ExchangeRate } from '@interlay/monetary-js';
import { Bitcoin, BitcoinAmount } from '@interlay/monetary-js';
import { MockProvider } from '@polkadot/rpc-provider/mock';
import Big from 'big.js';
import { mocked } from 'ts-jest/utils';

import App from '../../App';
import { act, cleanup, render, screen, userEvent } from '../test-utils';

// jest.mock('@polkadot/extension-dapp');

afterEach(cleanup);

const DEFAULT_BTC_BLOCK_HEIGHT = 1000;
const DEFAULT_TOKEN_AMOUNT = '1000000000000';

const SYSTEM_STATUS_RUNNING = { isRunning: true };

const DEFAULT_ISSUE_FEE = new Big(0.005);
const DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE = new Big(0.00005);

const DEFAULT_EXCHANGE_RATE = '1000000';

const DEFAULT_MAX_BURNABLE_TOKENS = atomicToBaseAmount('100000000', Bitcoin); // 1 BTC
const DEFAULT_BURN_EXCHANGE_RATE = '150000';

const mockedApiValue: RecursivePartial<InterBtcApi> = {
  tokens: {
    total: async (currency: interBtcApi.CurrencyExt) => newMonetaryAmount(DEFAULT_TOKEN_AMOUNT, currency)
  },
  btcRelay: { getLatestBlockHeight: async () => DEFAULT_BTC_BLOCK_HEIGHT },
  electrsAPI: { getLatestBlockHeight: async () => DEFAULT_BTC_BLOCK_HEIGHT },
  system: {
    getStatusCode: async () => SYSTEM_STATUS_RUNNING // Change to isError or isShutdown in order to simulate parachain being down.
  },
  fee: {
    getIssueFee: async () => DEFAULT_ISSUE_FEE,
    getIssueGriefingCollateralRate: async () => DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE
  },
  oracle: {
    getExchangeRate: (currency: interBtcApi.CurrencyExt) =>
      new ExchangeRate(Bitcoin, currency, Big(DEFAULT_EXCHANGE_RATE))
  },
  issue: {
    getDustValue: async () => BitcoinAmount.zero()
  },
  redeem: {
    getMaxBurnableTokens: async (_currency: interBtcApi.CurrencyExt) => DEFAULT_MAX_BURNABLE_TOKENS,
    getBurnExchangeRate: (collateralCurrency: interBtcApi.CollateralCurrencyExt) =>
      new ExchangeRate(Bitcoin, collateralCurrency, Big(DEFAULT_BURN_EXCHANGE_RATE))
  }
};

jest.mock('@interlay/interbtc-api', () => {
  const actualInterBtcApi = jest.requireActual('@interlay/interbtc-api');

  return {
    ...actualInterBtcApi,
    createInterBtcApi: jest.fn(async (..._argv) => mockedApiValue as InterBtcApi)
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
    // await waitForElementToBeRemoved(async () => await screen.findByRole('progressbar'), { timeout: 10000 });
    render(<App />, { path: '/bridge?tab=burn' });
    const burnTab = await screen.findByText('Burn');

    expect(burnTab).toBeVisible();
  });

  it('should burn the IBTC', async () => {
    render(<App />, { path: '/bridge?tab=burn' });
    const burnTab = await screen.findByText('Burn');
    userEvent.click(burnTab);
    await screen.findByText('Please enter the amount');
  });

  it.todo('should display collateral $ value to be received higher than burned $ value');
});
