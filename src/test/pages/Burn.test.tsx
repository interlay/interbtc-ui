import '@testing-library/jest-dom';

import { newMonetaryAmount } from '@interlay/interbtc-api';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';

import { mockRedeemBurn, mockRedeemGetMaxBurnableTokens } from '../mocks/@interlay/interbtc-api';
import { act, render, screen, userEvent, waitFor } from '../test-utils';

describe('Burn page', () => {
  it('the burn tab is displayed when there is a liquidated vault', async () => {
    await render(<App />, { path: '/bridge?tab=burn' });

    const burnTab = screen.getByRole('tab', { name: /burn/i });
    expect(burnTab).toBeVisible();
  });

  it('the burn method is called', async () => {
    await render(<App />, { path: '/bridge?tab=burn' });

    const burnTab = screen.getByRole('tab', { name: /burn/i });
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
    await waitFor(() => expect(mockRedeemBurn).toHaveBeenCalledTimes(1));
  });

  it('the burn tab is not displayed when there is no liquidated vault', async () => {
    mockRedeemGetMaxBurnableTokens.mockImplementation(() => newMonetaryAmount('0', WRAPPED_TOKEN));

    await render(<App />, { path: '/bridge?tab=burn' });

    await waitFor(() => {
      expect(screen.queryByText(/Burn/i)).not.toBeInTheDocument();
    });
  });
});
