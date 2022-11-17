// ray test touch <
import '@testing-library/jest-dom';

import App from '@/App';

import { render, screen } from '../test-utils';

describe('Redeem page', () => {
  it('should display the redeem tab', async () => {
    await render(<App />, { path: '/bridge?tab=redeem' });

    const redeemTab = screen.getByRole('tab', { name: /redeem/i });
    expect(redeemTab).toBeVisible();
  });
});
// ray test touch >
