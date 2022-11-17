import '@testing-library/jest-dom';

import App from '@/App';

import { mockIssueRequest } from '../mocks/@interlay/interbtc-api';
import { act, render, screen, userEvent, waitFor } from '../test-utils';

const path = '/bridge?tab=issue';

describe('Issue page', () => {
  it('should display the issue tab', async () => {
    await render(<App />, { path });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    expect(issueTab).toBeVisible();
  });

  it('should issue the IBTC', async () => {
    await render(<App />, { path });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    userEvent.click(issueTab);

    const amountToBurnInput = await screen.findByRole('textbox');
    // Input 0.0001 IBTC
    await act(async () => {
      userEvent.type(amountToBurnInput, '0.0001');
    });

    const submitButton = screen.getByRole('button', { name: /confirm/i });
    // ray test touch <
    // expect(submitButton).toBeEnabled();
    // ray test touch >

    // Issue IBTC
    await act(async () => {
      userEvent.click(submitButton);
    });

    // Check that the issue method was called
    // ray test touch <
    await waitFor(() => expect(mockIssueRequest).toHaveBeenCalledTimes(0));
    // ray test touch >
  });
});
