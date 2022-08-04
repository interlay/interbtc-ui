import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Bridge from '../../pages/Bridge';

describe('Burn page', () => {
  beforeEach(async () => {
    // TODO: mock the lib, so there's liquidated vault
  });

  it('should display burn tab when there is liquidated vault', async () => {
    render(<Bridge />);
    const burnTab = screen.getByText('Burn');

    expect(burnTab).toBeVisible();
  });

  it('should burn the IBTC');

  it('should display collateral $ value to be received higher than burned $ value');
});
