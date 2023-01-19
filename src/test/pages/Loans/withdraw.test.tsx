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

import { render, screen, userEvent, waitFor, waitForElementToBeRemoved } from '../../test-utils';
import { TABLES } from './constants';
import { withinModalTabPanel } from './utils';

const path = '/lending';
const tab = 'withdraw';

describe.skip('Withdraw Flow', () => {
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
    const { unmount } = await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

    // should render modal with ltv meter
    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();

    userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.SMALL);

    await waitFor(() => {
      expect(tabPanel.getByRole('button', { name: /withdraw/i })).not.toBeDisabled();
    });

    userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockWithdraw).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.SMALL);

    unmount();

    // SCENARIO: user is partially withdrawing when there are no borrow positions
    mockGetBorrowPositionsOfAccount.mockReturnValue([]);

    await render(<App />, { path });

    const tabPanel2 = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

    userEvent.type(tabPanel2.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel2.getByRole('button', { name: /withdraw/i })).not.toBeDisabled();
    });

    userEvent.click(tabPanel2.getByRole('button', { name: /withdraw/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockWithdraw).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.MEDIUM);
  });

  it('should be able to withdraw all', async () => {
    // SCENARIO: user is totally withdrawing when there are borrow positions
    const { unmount } = await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

    userEvent.click(
      tabPanel.getByRole('button', {
        name: /apply balance/i
      })
    );

    await waitFor(() => {
      expect(tabPanel.getByRole('button', { name: /withdraw/i })).not.toBeDisabled();
    });

    userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockWithdrawAll).not.toHaveBeenCalled();
    });

    unmount();

    // SCENARIO: user is totally withdrawing when there are no borrow positions
    mockGetBorrowPositionsOfAccount.mockReturnValue([]);

    await render(<App />, { path });

    const tabPanel2 = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

    userEvent.click(
      tabPanel2.getByRole('button', {
        name: /apply balance/i
      })
    );

    await waitFor(() => {
      expect(tabPanel2.getByRole('button', { name: /withdraw/i })).not.toBeDisabled();
    });

    userEvent.click(tabPanel2.getByRole('button', { name: /withdraw/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockWithdrawAll).toHaveBeenCalledWith(WRAPPED_TOKEN);
  });

  it('should not be able to withdraw', async () => {
    // SCENARIO: user is not able to partially withdraw, while not having enougth collateral,
    // when there is only a single asset as collateral
    const { unmount } = await render(<App />, { path });

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

    unmount();

    // SCENARIO: user is not able to partially withdraw, while not having enougth collateral,
    // when there is only a two assets as collateral
    mockGetLendPositionsOfAccount.mockReturnValue([DEFAULT_POSITIONS.LEND.IBTC, DEFAULT_POSITIONS.LEND.INTR]);

    await render(<App />, { path });

    const tabPanel2 = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

    userEvent.type(tabPanel2.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel2.getByRole('textbox', { name: 'withdraw amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel2.getByRole('button', { name: /withdraw/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockWithdraw).not.toHaveBeenCalled();
    });

    userEvent.click(
      tabPanel2.getByRole('button', {
        name: /apply balance/i
      })
    );

    await waitFor(() => {
      expect(tabPanel2.getByRole('textbox', { name: 'withdraw amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel2.getByRole('button', { name: /withdraw/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockWithdrawAll).not.toHaveBeenCalled();
    });
  });
});
