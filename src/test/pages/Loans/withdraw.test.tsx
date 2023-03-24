import '@testing-library/jest-dom';

import Big from 'big.js';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import {
  DEFAULT_BORROW_POSITIONS,
  DEFAULT_IBTC,
  DEFAULT_LEND_POSITIONS,
  DEFAULT_LENDING_STATS,
  DEFAULT_POSITIONS,
  mockCalculateLtvAndThresholdsChange,
  mockGetBorrowPositionsOfAccount,
  mockGetLendingStats,
  mockGetLendPositionsOfAccount,
  mockWithdraw,
  mockWithdrawAll
} from '@/test/mocks/@interlay/interbtc-api/parachain/loans';

import { act, render, screen, userEvent, waitFor } from '../../test-utils';
import { submitForm, withinModalTabPanel } from '../utils/table';
import { TABLES } from './constants';

const path = '/lending';
const tab = 'withdraw';

describe('Withdraw Flow', () => {
  beforeEach(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
    mockGetLendingStats.mockReturnValue(DEFAULT_LENDING_STATS);
  });

  it('should be able to partially withdraw when there are no borrow positions', async () => {
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, 'IBTC', tab, true);

    // should render modal with ltv meter
    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();

    userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.SMALL);

    await submitForm(tabPanel, 'withdraw');

    expect(mockWithdraw).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.SMALL);
  });

  it('should be able to withdraw all when there are no borrow positions by using max button', async () => {
    mockGetBorrowPositionsOfAccount.mockReturnValue([]);

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, 'IBTC', tab, true);

    userEvent.click(
      tabPanel.getByRole('button', {
        name: /max/i
      })
    );

    await submitForm(tabPanel, 'withdraw');

    expect(mockWithdrawAll).toHaveBeenCalledWith(WRAPPED_TOKEN);
  });

  it('should be able to withdraw all when there are no borrow positions by typing max amount', async () => {
    mockGetBorrowPositionsOfAccount.mockReturnValue([]);

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, 'IBTC', tab, true);

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

  it('should partially withdraw while applying max withdraw when there is low borrow limit', async () => {
    mockGetLendingStats.mockReturnValue({ ...DEFAULT_LENDING_STATS, borrowLimitBtc: DEFAULT_IBTC.MONETARY.VERY_SMALL });

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, 'IBTC', tab, true);

    userEvent.click(
      tabPanel.getByRole('button', {
        name: /max/i
      })
    );

    await submitForm(tabPanel, 'withdraw');

    expect(mockWithdraw).toHaveBeenCalled();
    expect(mockWithdrawAll).not.toHaveBeenCalled();
  });

  it('should not be able to withdraw due low borrow limit', async () => {
    mockGetLendingStats.mockReturnValue({ ...DEFAULT_LENDING_STATS, borrowLimitBtc: DEFAULT_IBTC.MONETARY.VERY_SMALL });

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, 'IBTC', tab, true);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'withdraw amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockWithdraw).not.toHaveBeenCalled();
      expect(mockWithdrawAll).not.toHaveBeenCalled();
    });
  });

  it('should display liquidation alert', async () => {
    mockCalculateLtvAndThresholdsChange.mockReturnValue({
      collateralThresholdWeightedAverage: new Big(0.5),
      liquidationThresholdWeightedAverage: new Big(0.75),
      ltv: new Big(0.75)
    });

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, 'IBTC', tab, true);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel.getByRole('alert')).toBeInTheDocument();
    });
  });
});
