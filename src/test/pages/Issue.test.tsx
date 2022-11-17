// ray test touch <
import '@testing-library/jest-dom';

import App from '@/App';

import { render, screen } from '../test-utils';

describe('Issue page', () => {
  it('should display issue tab', async () => {
    await render(<App />, { path: '/bridge?tab=issue' });

    const issueTab = await screen.findByText(/Issue/i);
    expect(issueTab).toBeVisible();
  });
});
// ray test touch >
