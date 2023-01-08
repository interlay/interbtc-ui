import '@testing-library/jest-dom';

import App from '@/App';

import { mockIssueRequest } from '../mocks/@interlay/interbtc-api';
import { act, render, screen, userEvent, waitFor } from '../test-utils';

describe('issue form', () => {
  it('issuing calls `issue.request` method', async () => {
    await render(<App />, { path: '/bridge?tab=issue' });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    userEvent.click(issueTab);

    const amountToIssueInput = screen.getByRole('textbox');

    await act(async () => {
      userEvent.type(amountToIssueInput, '0.0001');
    });

    const submitButton = screen.getByRole('button', { name: /confirm/i });

    await act(async () => {
      userEvent.click(submitButton);
    });

    await waitFor(() => expect(mockIssueRequest).toHaveBeenCalledTimes(1));
  });
});
