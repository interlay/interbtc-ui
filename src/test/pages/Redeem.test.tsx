import '@testing-library/jest-dom';

import App from '@/App';

import { mockRedeemRequest } from '../mocks/@interlay/interbtc-api';
import { act, render, screen, userEvent, waitFor } from '../test-utils';

describe('redeemTab page', () => {
  it('should redeem the IBTC', async () => {
    await render(<App />, { path: '/bridge?tab=redeem' });

    const redeemTab = screen.getByRole('tab', { name: /redeem/i });
    userEvent.click(redeemTab);

    // Input 0.0001 IBTC
    const textboxElements = screen.getAllByRole('textbox');

    const amountToRedeemInput = textboxElements[0];

    await act(async () => {
      // ray test touch <
      // TODO: input a random value using `fake`
      userEvent.type(amountToRedeemInput, '0.0001');
      // ray test touch >
    });

    const btcAddressToSendInput = textboxElements[1];

    await act(async () => {
      userEvent.type(btcAddressToSendInput, 'tb1q3f6lu0g92q0d5jdng6m367uwpw7lnt7x3n0nqf');
    });

    // ray test touch <
    // ray test touch >

    const submitButton = screen.getByRole('button', { name: /confirm/i });

    // Redeem IBTC
    await act(async () => {
      userEvent.click(submitButton);
    });

    // Check that the redeem method was called
    await waitFor(() => expect(mockRedeemRequest).toHaveBeenCalledTimes(1));
  });
});
