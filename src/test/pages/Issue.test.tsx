import '@testing-library/jest-dom';

import App from '@/App';

import { render, screen } from '../test-utils';

// ray test touch <
const path = '/bridge?tab=issue';
// ray test touch >

describe('Issue page', () => {
  it('should display issue tab', async () => {
    await render(<App />, { path });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    expect(issueTab).toBeVisible();
  });

  // ray test touch <
  // it('should issue the IBTC', async () => {
  //   await render(<App />, { path });
  // });
  // ray test touch >
});
