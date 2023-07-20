import '@testing-library/jest-dom';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { MOCK_LOANS } from '@/test/mocks/@interlay/interbtc-api';

import { render, userEvent, waitFor } from '../../test-utils';
import { submitForm, withinModalTabPanel } from '../utils/table';
import { waitForFeeEstimate, waitForTransactionExecute } from '../utils/transaction';
import { TABLES } from './constants';

const {
  getBorrowPositionsOfAccount,
  getLendPositionsOfAccount,
  getLoanAssets,
  getLendingStats,
  borrow
} = MOCK_LOANS.MODULE;
const { LOAN_POSITIONS, ASSETS, LENDING_STATS, WRAPPED_LOAN } = MOCK_LOANS.DATA;

const path = '/lending';
const tab = 'borrow';

jest.mock('../../../parts/Layout', () => {
  const MockedLayout: React.FC = ({ children }: any) => children;
  MockedLayout.displayName = 'MockedLayout';
  return MockedLayout;
});

describe('Borrow Flow', () => {
  beforeEach(() => {
    getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.EMPTY);
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.AVERAGE_COLLATERAL);
    getLoanAssets.mockReturnValue(ASSETS.NORMAL);
    getLendingStats.mockReturnValue(LENDING_STATS.LOW_LTV);
  });

  it('should be able to borrow', async () => {
    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.BORROW.MARKET, WRAPPED_LOAN.ASSET.currency.ticker, tab);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), WRAPPED_LOAN.AMOUNT.VERY_SMALL.VALUE);

    await waitForFeeEstimate(borrow);

    await submitForm(tabPanel, 'borrow');

    await waitForTransactionExecute(borrow);

    expect(borrow).toHaveBeenCalledWith(WRAPPED_TOKEN, WRAPPED_LOAN.AMOUNT.VERY_SMALL.MONETARY);
  });

  it('should not be able to borrow due to borrow limit', async () => {
    getLendingStats.mockReturnValue(LENDING_STATS.MIN_BORROW_LIMIT);

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.BORROW.MARKET, WRAPPED_LOAN.ASSET.currency.ticker, tab);

    // If there is collateral, modal LTV meter should be rendered
    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();

    userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), WRAPPED_LOAN.AMOUNT.VERY_SMALL.VALUE);

    userEvent.tab();

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'borrow amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

    await waitFor(() => {
      expect(borrow).not.toHaveBeenCalled();
    });
  });

  it('should not be able to borrow due lack of available capacity', async () => {
    getLoanAssets.mockReturnValue(ASSETS.EMPTY_CAPACITY);

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.BORROW.MARKET, WRAPPED_LOAN.ASSET.currency.ticker, tab);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), WRAPPED_LOAN.AMOUNT.VERY_SMALL.VALUE);

    userEvent.tab();

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'borrow amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

    await waitFor(() => {
      expect(borrow).not.toHaveBeenCalled();
    });
  });

  it('should not be able to borrow due too many borrows', async () => {
    getLoanAssets.mockReturnValue(ASSETS.OVER_BORROWED);

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.BORROW.MARKET, WRAPPED_LOAN.ASSET.currency.ticker, tab);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), WRAPPED_LOAN.AMOUNT.VERY_SMALL.VALUE);

    userEvent.tab();

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'borrow amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

    await waitFor(() => {
      expect(borrow).not.toHaveBeenCalled();
    });
  });

  it('should display liquidation alert', async () => {
    getLendingStats.mockReturnValue(LENDING_STATS.LIQUIDATION);

    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.BORROW.MARKET, WRAPPED_LOAN.ASSET.currency.ticker, tab);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), WRAPPED_LOAN.AMOUNT.VERY_SMALL.VALUE);

    await waitFor(() => {
      expect(tabPanel.getByRole('alert')).toBeInTheDocument();
    });
  });
});
