import '@testing-library/jest-dom';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { MOCK_LOANS } from '@/test/mocks/@interlay/interbtc-api';

import { render, screen, userEvent, waitFor } from '../../test-utils';
import { submitForm, withinModalTabPanel } from '../utils/table';
import { waitForFeeEstimate, waitForTransactionExecute } from '../utils/transaction';
import { TABLES } from './constants';

const {
  getBorrowPositionsOfAccount,
  getLendPositionsOfAccount,
  getLoanAssets,
  getLendingStats,
  withdraw,
  withdrawAll
} = MOCK_LOANS.MODULE;

const { LOAN_POSITIONS, ASSETS, LENDING_STATS, WRAPPED_LOAN } = MOCK_LOANS.DATA;

const path = '/lending';
const tab = 'withdraw';

describe('Withdraw Flow', () => {
  beforeEach(() => {
    getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.EMPTY);
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.AVERAGE_COLLATERAL);
    getLoanAssets.mockReturnValue(ASSETS.NORMAL);
    getLendingStats.mockReturnValue(LENDING_STATS.LOW_LTV);
  });

  it('should be able to partially withdraw when there are no borrow positions', async () => {
    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.LEND.POSITION, WRAPPED_LOAN.ASSET.currency.ticker, tab, true);

    // should render modal with ltv meter
    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();

    userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), WRAPPED_LOAN.AMOUNT.SMALL.VALUE);

    await waitForFeeEstimate(withdraw);

    await submitForm(tabPanel, 'withdraw');

    await waitForTransactionExecute(withdraw);

    expect(withdraw).toHaveBeenCalledWith(WRAPPED_TOKEN, WRAPPED_LOAN.AMOUNT.SMALL.MONETARY);
  });

  it('should be able to withdraw all when there are no borrow positions by using max button', async () => {
    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.LEND.POSITION, WRAPPED_LOAN.ASSET.currency.ticker, tab, true);

    userEvent.click(
      tabPanel.getByRole('button', {
        name: /max/i
      })
    );

    await waitForFeeEstimate(withdrawAll);

    await submitForm(tabPanel, 'withdraw');

    await waitForTransactionExecute(withdrawAll);

    expect(withdrawAll).toHaveBeenCalledWith(WRAPPED_TOKEN);
  });

  it('should be able to withdraw all when there are no borrow positions by typing max amount', async () => {
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.AVERAGE_COLLATERAL);

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.LEND.POSITION, WRAPPED_LOAN.ASSET.currency.ticker, tab, true);

    userEvent.type(
      tabPanel.getByRole('textbox', { name: 'withdraw amount' }),
      WRAPPED_LOAN.POSITIONS.LEND.COLLATERAL.amount.toString()
    );

    await waitForFeeEstimate(withdrawAll);

    await submitForm(tabPanel, 'withdraw');

    await waitForTransactionExecute(withdrawAll);

    expect(withdrawAll).toHaveBeenCalledWith(WRAPPED_TOKEN);
  });

  it.only('should partially withdraw while applying max withdraw when there is low borrow limit', async () => {
    getLendingStats.mockReturnValue(LENDING_STATS.LOW_BORROW_LIMIT);

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.LEND.POSITION, WRAPPED_LOAN.ASSET.currency.ticker, tab, true);

    userEvent.click(
      tabPanel.getByRole('button', {
        name: /max/i
      })
    );

    await submitForm(tabPanel, 'withdraw');

    expect(withdraw).toHaveBeenCalled();
    expect(withdrawAll).not.toHaveBeenCalled();
  });

  it('should not be able to withdraw due low borrow limit', async () => {
    getLendingStats.mockReturnValue(LENDING_STATS.LOW_BORROW_LIMIT);

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.LEND.POSITION, 'IBTC', tab, true);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), WRAPPED_LOAN.AMOUNT.MEDIUM.VALUE);

    // TODO: should remove this when form ticker is revised
    userEvent.tab();

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'withdraw amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(withdraw).not.toHaveBeenCalled();
      expect(withdrawAll).not.toHaveBeenCalled();
    });
  });

  it('should display liquidation alert', async () => {
    mockCalculateLtvAndThresholdsChange.mockReturnValue({
      collateralThresholdWeightedAverage: new Big(0.5),
      liquidationThresholdWeightedAverage: new Big(0.75),
      ltv: new Big(0.75)
    });

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.LEND.POSITION, 'IBTC', tab, true);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel.getByRole('alert')).toBeInTheDocument();
    });
  });
});
