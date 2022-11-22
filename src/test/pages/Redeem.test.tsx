import '@testing-library/jest-dom';

import App from '@/App';

import { act, render, screen, userEvent } from '../test-utils';

const path = '/bridge?tab=redeem';

describe('redeemTab page', () => {
  it('should display the redeem tab', async () => {
    await render(<App />, { path });

    const redeemTab = screen.getByRole('tab', { name: /redeem/i });
    expect(redeemTab).toBeVisible();
  });

  it('should redeem the IBTC', async () => {
    await render(<App />, { path });

    const redeemTab = screen.getByRole('tab', { name: /redeem/i });
    userEvent.click(redeemTab);

    // Input 0.0001 IBTC
    const textboxElements = screen.getAllByRole('textbox');

    const amountToRedeemInput = textboxElements[0];

    await act(async () => {
      userEvent.type(amountToRedeemInput, '0.0001');
    });
  });
});
