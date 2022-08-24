import '@testing-library/jest-dom';

import interBtcApi from '@interlay/interbtc-api';
import { Route } from 'react-router';

import App from '../../App';
import { cleanup, render, screen, waitForElementToBeRemoved } from '../test-utils';
afterEach(cleanup);
// const interbtcApi = jest.createMockFromModule('@interlay/interbtc-api');
jest.mock('@interlay/interbtc-api');

interBtcApi.DefaultRedeemAPI.describe('Burn page', () => {
  beforeEach(async () => {
    // TODO: mock the lib, so there's liquidated vault
    // return from window.bridge.redeem.getMaxBurnableTokens() > 0
  });

  it('should display burn tab when there is liquidated vault', async () => {
    render(<App />, { path: '/bridge?tab=burn' });
    // await waitForElementToBeRemoved(async () => await screen.findByRole('progressbar'), { timeout: 10000 });
    await screen.findByText('Redeem');
    const burnTab = screen.getByText('Redeem');

    expect(burnTab).toBeVisible();
  });

  it.todo('should burn the IBTC');

  it.todo('should display collateral $ value to be received higher than burned $ value');
});
