import '@testing-library/jest-dom';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import {
  DEFAULT_BORROW_POSITIONS,
  DEFAULT_IBTC,
  DEFAULT_LEND_POSITIONS,
  DEFAULT_POSITIONS,
  mockGetBorrowPositionsOfAccount,
  mockGetLendPositionsOfAccount,
  mockWithdraw,
  mockWithdrawAll
} from '@/test/mocks/@interlay/interbtc-api/parachain/loans';

import { act, render, screen, userEvent, waitFor } from '../../test-utils';
import { TABLES } from './constants';
import { submitForm, withinModalTabPanel } from './utils';

const path = '/lending';
const tab = 'withdraw';

describe('Withdraw Flow', () => {
  beforeEach(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  afterAll(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  it('should be able to partially withdraw', async () => {
    // SCENARIO: user is partially withdrawing when there are borrow positions
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

    // should render modal with ltv meter
    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();

    userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.SMALL);

    await submitForm(tabPanel, 'withdraw');

    expect(mockWithdraw).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.SMALL);
  });

  it('should be able to withdraw all', async () => {
    // SCENARIO: user is withdrawing all when there are no borrow positions (by clicking max)
    mockGetBorrowPositionsOfAccount.mockReturnValue([]);

    const { unmount } = await render(<App />, { path });

    let tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

    userEvent.click(
      tabPanel.getByRole('button', {
        name: /max/i
      })
    );

    await submitForm(tabPanel, 'withdraw');

    expect(mockWithdrawAll).toHaveBeenCalledWith(WRAPPED_TOKEN);

    unmount();

    // SCENARIO: user is withdrawing all when there are no borrow positions (by typing max)
    mockWithdrawAll.mockRestore();

    await render(<App />, { path });

    tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

    userEvent.type(
      tabPanel.getByRole('textbox', { name: 'withdraw amount' }),
      DEFAULT_POSITIONS.LEND.IBTC.amount.toString()
    );

    // Wait for debounce
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    await submitForm(tabPanel, 'withdraw');

    expect(mockWithdrawAll).toHaveBeenCalledWith(WRAPPED_TOKEN);
  });

  it('should not be able to withdraw', async () => {
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'withdraw amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockWithdraw).not.toHaveBeenCalled();
    });

    userEvent.click(
      tabPanel.getByRole('button', {
        name: /max/i
      })
    );

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'withdraw amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockWithdrawAll).not.toHaveBeenCalled();
    });
  });
});
