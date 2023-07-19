import '@testing-library/jest-dom';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { MOCK_LOANS } from '@/test/mocks/@interlay/interbtc-api';

import { render, userEvent } from '../../test-utils';
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

  // it('should not be able to borrow due to borrow limit', async () => {
  //   mockCalculateBorrowLimitBtcChange.mockReturnValue(DEFAULT_IBTC.MONETARY.VERY_SMALL);
  //   mockGetLendingStats.mockReturnValue({ ...DEFAULT_LENDING_STATS, borrowLimitBtc: DEFAULT_IBTC.MONETARY.VERY_SMALL });

  //   await render(<App />, { path });

  //   const tabPanel = await withinModalTabPanel(TABLES.BORROW.POSITION, 'IBTC', tab, true);

  //   // If there is collateral, modal LTV meter should be rendered
  //   expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();

  //   userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

  //   await waitFor(() => {
  //     expect(tabPanel.getByRole('textbox', { name: 'borrow amount' })).toHaveErrorMessage('');
  //   });

  //   userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

  //   await waitFor(() => {
  //     expect(mockBorrow).not.toHaveBeenCalled();
  //   });
  // });

  // it('should not be able to borrow due lack of available capacity', async () => {
  //   mockGetLoanAssets.mockReturnValue({
  //     ...DEFAULT_ASSETS,
  //     IBTC: { ...DEFAULT_IBTC_LOAN_ASSET, availableCapacity: DEFAULT_IBTC.MONETARY.VERY_SMALL }
  //   });

  //   await render(<App />, { path });

  //   const tabPanel = await withinModalTabPanel(TABLES.BORROW.POSITION, 'IBTC', tab, true);

  //   userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

  //   await waitFor(() => {
  //     expect(tabPanel.getByRole('textbox', { name: 'borrow amount' })).toHaveErrorMessage('');
  //   });

  //   userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

  //   await waitFor(() => {
  //     expect(mockBorrow).not.toHaveBeenCalled();
  //   });
  // });

  // it('should not be able to borrow due too many borrows', async () => {
  //   mockGetLoanAssets.mockReturnValue({
  //     ...DEFAULT_ASSETS,
  //     IBTC: {
  //       ...DEFAULT_IBTC_LOAN_ASSET,
  //       borrowCap: DEFAULT_IBTC.MONETARY.MEDIUM,
  //       totalBorrows: DEFAULT_IBTC.MONETARY.MEDIUM
  //     }
  //   });

  //   await render(<App />, { path });

  //   const tabPanel = await withinModalTabPanel(TABLES.BORROW.POSITION, 'IBTC', tab, true);

  //   userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

  //   await waitFor(() => {
  //     expect(tabPanel.getByRole('textbox', { name: 'borrow amount' })).toHaveErrorMessage('');
  //   });

  //   userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

  //   await waitFor(() => {
  //     expect(mockBorrow).not.toHaveBeenCalled();
  //   });
  // });

  // it('should display liquidation alert', async () => {
  //   mockCalculateLtvAndThresholdsChange.mockReturnValue({
  //     collateralThresholdWeightedAverage: new Big(0.5),
  //     liquidationThresholdWeightedAverage: new Big(0.75),
  //     ltv: new Big(0.75)
  //   });

  //   await render(<App />, { path });

  //   const tabPanel = await withinModalTabPanel(TABLES.BORROW.POSITION, 'IBTC', tab, true);

  //   userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

  //   await waitFor(() => {
  //     expect(tabPanel.getByRole('alert')).toBeInTheDocument();
  //   });
  // });
});
