import '@testing-library/jest-dom';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { MOCK_LOANS, MOCK_TOKENS } from '@/test/mocks/@interlay/interbtc-api';

import { render, screen, userEvent, waitFor } from '../../test-utils';
import { submitForm, withinModalTabPanel } from '../utils/table';
import { getFeeTokenSelect, waitForFeeEstimate, waitForTransactionExecute } from '../utils/transaction';
import { TABLES } from './constants';

const {
  getBorrowPositionsOfAccount,
  getLendPositionsOfAccount,
  getLoanAssets,
  getLendingStats,
  lend
} = MOCK_LOANS.MODULE;
const { balance } = MOCK_TOKENS.MODULE;

const { LOAN_POSITIONS, ASSETS, LENDING_STATS, WRAPPED_LOAN } = MOCK_LOANS.DATA;
const { BALANCE_FN } = MOCK_TOKENS.DATA;

const path = '/lending';
const tab = 'lend';

describe('Lending Flow', () => {
  beforeEach(() => {
    getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.EMPTY);
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.AVERAGE_COLLATERAL);
    getLoanAssets.mockReturnValue(ASSETS.NORMAL);
    getLendingStats.mockReturnValue(LENDING_STATS.LOW_LTV);
    balance.mockImplementation(BALANCE_FN.FULL);
  });

  it('should be able to lend', async () => {
    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.LEND.POSITION, WRAPPED_LOAN.ASSET.currency.ticker, tab);

    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();
    expect(getFeeTokenSelect(tabPanel)).toBeInTheDocument();

    userEvent.type(tabPanel.getByRole('textbox', { name: 'lend amount' }), WRAPPED_LOAN.AMOUNT.MEDIUM.VALUE);

    await waitForFeeEstimate(lend);

    await submitForm(tabPanel, 'lend');

    await waitForTransactionExecute(lend);

    expect(lend).toHaveBeenCalledWith(WRAPPED_TOKEN, WRAPPED_LOAN.AMOUNT.MEDIUM.MONETARY);
  });

  it('should not be able to lend over available balance', async () => {
    balance.mockImplementation(BALANCE_FN.EMPTY);

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.LEND.POSITION, 'IBTC', tab);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'lend amount' }), WRAPPED_LOAN.AMOUNT.MEDIUM.VALUE);

    // TODO: should remove this when form ticker is revised
    userEvent.tab();

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'lend amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /lend/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(lend).not.toHaveBeenCalled();
    });
  });

  it('should not be able to lend due to lack of supply cap', async () => {
    getLoanAssets.mockReturnValue(ASSETS.EMPTY_CAPACITY);

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.LEND.POSITION, 'IBTC', tab);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'lend amount' }), WRAPPED_LOAN.AMOUNT.MEDIUM.VALUE);

    // TODO: should remove this when form ticker is revised
    userEvent.tab();

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'lend amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /lend/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(lend).not.toHaveBeenCalled();
    });
  });
});
