import '@testing-library/jest-dom';

import App from '../../App';
import { render, screen } from '../test-utils';

describe('Burn page', () => {
  beforeEach(async () => {
    // TODO: mock the lib, so there's liquidated vault
  });

  it('should display burn tab when there is liquidated vault', async () => {
    render(<App />, { path: '/bridge?tab=burn' });
    const burnTab = screen.getByText('Burn');

    expect(burnTab).toBeVisible();
  });

  it('should burn the IBTC');

  it('should display collateral $ value to be received higher than burned $ value');
});
