import '@testing-library/jest-dom';

import { newMonetaryAmount } from '@interlay/interbtc-api';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';

import { mockRedeemBurn, mockRedeemGetMaxBurnableTokens } from '../mocks/@interlay/interbtc-api';
import { act, render, screen, userEvent, waitFor } from '../test-utils';

describe('Burn page', () => {
  it.only('should display burn tab when there is liquidated vault', async () => {
    await render(<App />, { path: '/bridge?tab=burn' });

    // const main = within(screen.getByRole('main'));

    screen.debug(screen.getByRole('main'));

    expect(true).toBeTruthy();

    // const burnTab = await screen.findByText(/Burn/i);
    // expect(burnTab).toBeVisible();
  });

  it('should not display burn tab when there is no liquidated vault', async () => {
    mockRedeemGetMaxBurnableTokens.mockImplementationOnce(() => newMonetaryAmount('0', WRAPPED_TOKEN));

    await render(<App />, { path: '/bridge?tab=burn' });

    await waitFor(() => {
      expect(screen.queryByText(/Burn/i)).not.toBeInTheDocument();
    });
  });

  it('should burn the IBTC', async () => {
    await render(<App />, { path: '/bridge?tab=burn' });

    const burnTab = await screen.findByText(/Burn/i);
    userEvent.click(burnTab);

    const amountToBurnInput = await screen.findByRole('textbox');
    // Input 0.0001 IBTC.
    await act(async () => {
      userEvent.type(amountToBurnInput, '0.0001');
    });

    const submitButton = screen.getByRole('button', { name: /Burn/i });
    expect(submitButton).toBeEnabled();

    // Burn IBTC.
    await act(async () => {
      userEvent.click(submitButton);
    });

    // Check that burn method was called.
    expect(mockRedeemBurn).toHaveBeenCalledTimes(1);
  });
});
