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

    // ray test touch <
    // Input 0.0001 IBTC
    const amountToRedeemInput = await screen.findByRole('textbox');
    await act(async () => {
      userEvent.type(amountToRedeemInput, '0.0001');
    });
    // ray test touch >
  });
});
