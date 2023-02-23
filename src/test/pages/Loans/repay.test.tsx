import '@testing-library/jest-dom';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { mockTokensBalance } from '@/test/mocks/@interlay/interbtc-api';
import {
  DEFAULT_BORROW_POSITIONS,
  DEFAULT_IBTC,
  DEFAULT_LEND_POSITIONS,
  DEFAULT_POSITIONS,
  mockGetBorrowPositionsOfAccount,
  mockGetLendPositionsOfAccount,
  mockRepay,
  mockRepayAll
} from '@/test/mocks/@interlay/interbtc-api/parachain/loans';

import { act, render, screen, userEvent, waitFor } from '../../test-utils';
import { TABLES } from './constants';
import { submitForm, withinModalTabPanel } from './utils';

const path = '/lending';
const tab = 'repay';

describe('Repay Flow', () => {
  beforeEach(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  afterAll(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  it('should be able to repay', async () => {
    // SCENARIO: user is partially repaying loan
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    // should render modal with ltv meter
    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();

    userEvent.type(tabPanel.getByRole('textbox', { name: 'repay amount' }), DEFAULT_IBTC.AMOUNT.SMALL);

    await submitForm(tabPanel, 'repay');

    expect(mockRepay).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.SMALL);
  });

  it('should be able repay all', async () => {
    const { unmount } = await render(<App />, { path });

    let tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    userEvent.click(
      tabPanel.getByRole('button', {
        name: /max/i
      })
    );

    await submitForm(tabPanel, 'repay');

    expect(mockRepayAll).toHaveBeenCalledWith(WRAPPED_TOKEN);

    unmount();

    mockRepayAll.mockRestore();

    await render(<App />, { path });

    tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    const replayAllAmount = DEFAULT_POSITIONS.BORROW.IBTC.amount.add(DEFAULT_POSITIONS.BORROW.IBTC.accumulatedDebt);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'repay amount' }), replayAllAmount.toString());

    // Wait for debounce
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    await submitForm(tabPanel, 'repay');

    expect(mockRepayAll).toHaveBeenCalledWith(WRAPPED_TOKEN);
  });

  it('should not be able to repay over available balance', async () => {
    mockTokensBalance.emptyBalance();

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'repay amount' }), DEFAULT_IBTC.AMOUNT.VERY_LARGE);

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'repay amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /repay/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockRepay).not.toHaveBeenCalled();
    });

    mockTokensBalance.restore();
  });
});
