import '@testing-library/jest-dom';

import * as interBtcApi from '@interlay/interbtc-api';
import { InterBtcApi, newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';
import { MockProvider } from '@polkadot/rpc-provider/mock';
import { mocked } from 'ts-jest';

import App from '../../App';
import { cleanup, render, screen, waitForElementToBeRemoved } from '../test-utils';
afterEach(cleanup);

jest.mock('@interlay/interbtc-api');
const mockedApi = mocked(interBtcApi);

const mockProvider = () => {
  const registry = interBtcApi.createAPIRegistry();
  return new MockProvider(registry);
};

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const mockedApiValue: RecursivePartial<InterBtcApi> = {
  tokens: {
    total: async (currency) => newMonetaryAmount('1000000000000', currency)
  },
  redeem: {
    getMaxBurnableTokens: async () => new BitcoinAmount('100000000')
  }
};

// Replace provider with mock provider to not connect
mockedApi.createInterBtcApi.mockResolvedValue(mockedApiValue as InterBtcApi);
// mockedApi.createInterBtcApi.mockResolvedValue();
describe('Burn page', () => {
  beforeEach(async () => {
    // TODO: mock the lib, so there's liquidated vault
    // return from window.bridge.redeem.getMaxBurnableTokens() > 0
  });

  it('should display burn tab when there is liquidated vault', async () => {
    render(<App />, { path: '/bridge?tab=burn' });
    await waitForElementToBeRemoved(async () => await screen.findByRole('progressbar'), { timeout: 10000 });
    await screen.findByText('Burn');
    const burnTab = screen.getByText('Burn');

    expect(burnTab).toBeVisible();
  });

  it.todo('should burn the IBTC');

  it.todo('should display collateral $ value to be received higher than burned $ value');
});
