import '@testing-library/jest-dom';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import {
  DEFAULT_ASSETS,
  DEFAULT_BORROW_POSITIONS,
  DEFAULT_IBTC,
  DEFAULT_IBTC_LOAN_ASSET,
  DEFAULT_LEND_POSITIONS,
  DEFAULT_LENDING_STATS,
  mockBorrow,
  mockCalculateBorrowLimitBtcChange,
  mockGetBorrowPositionsOfAccount,
  mockGetLendingStats,
  mockGetLendPositionsOfAccount,
  mockGetLoanAssets
} from '@/test/mocks/@interlay/interbtc-api/parachain/loans';

import { render, userEvent, waitFor } from '../../test-utils';
import { submitForm, withinModalTabPanel } from '../utils/loans';
import { TABLES } from './constants';

const path = '/lending';
const tab = 'borrow';

jest.mock('../../../parts/Layout', () => {
  const MockedLayout: React.FC = ({ children }: any) => children;
  MockedLayout.displayName = 'MockedLayout';
  return MockedLayout;
});

describe('Borrow Flow', () => {
  beforeEach(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
    mockGetLendingStats.mockReturnValue(DEFAULT_LENDING_STATS);
  });

  afterAll(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
    mockGetLendingStats.mockReturnValue(DEFAULT_LENDING_STATS);
  });

  it('should be able to borrow', async () => {
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC');

    userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.SMALL);

    await submitForm(tabPanel, 'borrow');

    expect(mockBorrow).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.SMALL);
  });

  it('should not be able to borrow due to borrow limit', async () => {
    mockCalculateBorrowLimitBtcChange.mockReturnValue(DEFAULT_IBTC.MONETARY.VERY_SMALL);
    mockGetLendingStats.mockReturnValue({ ...DEFAULT_LENDING_STATS, borrowLimitBtc: DEFAULT_IBTC.MONETARY.VERY_SMALL });

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    // If there is collateral, modal LTV meter should be rendered
    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();

    userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'borrow amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

    await waitFor(() => {
      expect(mockBorrow).not.toHaveBeenCalled();
    });
  });

  it('should not be able to borrow due lack of available capacity', async () => {
    mockGetLoanAssets.mockReturnValue({
      ...DEFAULT_ASSETS,
      IBTC: { ...DEFAULT_IBTC_LOAN_ASSET, availableCapacity: DEFAULT_IBTC.MONETARY.VERY_SMALL }
    });

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'borrow amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

    await waitFor(() => {
      expect(mockBorrow).not.toHaveBeenCalled();
    });
  });

  it('should not be able to borrow due too many borrows', async () => {
    mockGetLoanAssets.mockReturnValue({
      ...DEFAULT_ASSETS,
      IBTC: {
        ...DEFAULT_IBTC_LOAN_ASSET,
        borrowCap: DEFAULT_IBTC.MONETARY.MEDIUM,
        totalBorrows: DEFAULT_IBTC.MONETARY.MEDIUM
      }
    });

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'borrow amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

    await waitFor(() => {
      expect(mockBorrow).not.toHaveBeenCalled();
    });
  });
});
