import '@testing-library/jest-dom';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { MOCK_TOKENS } from '@/test/mocks/@interlay/interbtc-api';
import { MOCK_LOANS } from '@/test/mocks/@interlay/interbtc-api/parachain/loans';

import { render, screen, userEvent, waitFor } from '../../test-utils';
import { submitForm, withinModalTabPanel } from '../utils/table';
import { waitForFeeEstimate, waitForTransactionExecute } from '../utils/transaction';
import { TABLES } from './constants';

const {
  getBorrowPositionsOfAccount,
  getLendPositionsOfAccount,
  getLoanAssets,
  getLendingStats,
  repay,
  repayAll
} = MOCK_LOANS.MODULE;
const { balance } = MOCK_TOKENS.MODULE;

const { LOAN_POSITIONS, ASSETS, LENDING_STATS, WRAPPED_LOAN } = MOCK_LOANS.DATA;
const { BALANCE_FN } = MOCK_TOKENS.DATA;

const path = '/lending';
const tab = 'repay';

describe('Repay Flow', () => {
  beforeEach(() => {
    getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.AVERAGE);
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.AVERAGE_COLLATERAL);
    getLoanAssets.mockReturnValue(ASSETS.NORMAL);
    getLendingStats.mockReturnValue(LENDING_STATS.LOW_LTV);
    balance.mockImplementation(BALANCE_FN.FULL);
  });

  it('should be able to partial repay', async () => {
    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.BORROW.POSITION, WRAPPED_LOAN.ASSET.currency.ticker, tab, true);

    // should render modal with ltv meter
    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();

    userEvent.type(tabPanel.getByRole('textbox', { name: 'repay amount' }), WRAPPED_LOAN.AMOUNT.VERY_SMALL.VALUE);

    await waitForFeeEstimate(repay);

    await submitForm(tabPanel, 'repay');

    await waitForTransactionExecute(repay);

    expect(repay).toHaveBeenCalledWith(WRAPPED_TOKEN, WRAPPED_LOAN.AMOUNT.VERY_SMALL.MONETARY);
  });

  it('should be able repay all by using max button', async () => {
    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.BORROW.POSITION, WRAPPED_LOAN.ASSET.currency.ticker, tab, true);

    userEvent.click(
      tabPanel.getByRole('button', {
        name: /max/i
      })
    );

    await waitForFeeEstimate(repayAll);

    await submitForm(tabPanel, 'repay');

    await waitForTransactionExecute(repayAll);

    expect(repayAll).toHaveBeenCalledWith(WRAPPED_TOKEN);
  });

  it('should be able repay all by typing max amount', async () => {
    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.BORROW.POSITION, WRAPPED_LOAN.ASSET.currency.ticker, tab, true);

    const replayAllAmount = WRAPPED_LOAN.POSITIONS.BORROW.amount.add(WRAPPED_LOAN.POSITIONS.BORROW.accumulatedDebt);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'repay amount' }), replayAllAmount.toString());

    await waitForFeeEstimate(repayAll);

    await submitForm(tabPanel, 'repay');

    await waitForTransactionExecute(repayAll);

    expect(repayAll).toHaveBeenCalledWith(WRAPPED_TOKEN);
  });

  it('should not be able to repay over available balance', async () => {
    balance.mockImplementation(BALANCE_FN.EMPTY);

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.BORROW.POSITION, WRAPPED_LOAN.ASSET.currency.ticker, tab, true);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'repay amount' }), WRAPPED_LOAN.AMOUNT.VERY_SMALL.VALUE);

    userEvent.tab();

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'repay amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /repay/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(repay).not.toHaveBeenCalled();
      expect(repayAll).not.toHaveBeenCalled();
    });
  });

  it('should partially repay loan while applying max balance when there are not enough funds to pay the entire loan', async () => {
    balance.mockImplementation(BALANCE_FN.CUSTOM(WRAPPED_LOAN.POSITIONS.BORROW.amount));

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.BORROW.POSITION, WRAPPED_LOAN.ASSET.currency.ticker, tab, true);

    userEvent.click(
      tabPanel.getByRole('button', {
        name: /max/i
      })
    );

    await waitForFeeEstimate(repay);

    await submitForm(tabPanel, 'repay');

    await waitForTransactionExecute(repay);

    expect(repay).toHaveBeenCalledWith(WRAPPED_TOKEN, WRAPPED_LOAN.POSITIONS.BORROW.amount);
  });
});
