import '@testing-library/jest-dom';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { MOCK_LOANS } from '@/test/mocks/@interlay/interbtc-api';

import { render, userEvent } from '../../test-utils';
import { submitForm, withinModalTabPanel } from '../utils/table';
import { TABLES } from './constants';

const {
  getBorrowPositionsOfAccount,
  getLendPositionsOfAccount,
  getLoanAssets,
  getLendingStats,
  lend
} = MOCK_LOANS.MODULE;
const { LOAN_POSITIONS, ASSETS, LENDING_STATS, WRAPPED_LOAN } = MOCK_LOANS.DATA;

const path = '/lending';
const tab = 'lend';

describe('Lending Flow', () => {
  beforeEach(() => {
    getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.EMPTY);
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.AVERAGE);
    getLoanAssets.mockReturnValue(ASSETS);
    getLendingStats.mockReturnValue(LENDING_STATS.LOW_LTV);
  });

  it('should be able to lend', async () => {
    await render(<App />, { path });

    const tabPanel = await withinModalTabPanel(TABLES.LEND.POSITION, WRAPPED_LOAN.ASSET.currency.ticker, tab);

    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();

    userEvent.type(tabPanel.getByRole('textbox', { name: 'lend amount' }), WRAPPED_LOAN.AMOUNT.MEDIUM.VALUE);

    await submitForm(tabPanel, 'lend');

    expect(lend).toHaveBeenCalledWith(WRAPPED_TOKEN, WRAPPED_LOAN.AMOUNT.MEDIUM.MONETARY);
  });

  //   it('should not be able to lend over available balance', async () => {
  //     mockTokensBalance.mockImplementation(EMPTY_TOKENS_BALANCE_FN);

  //     await render(<App />, { path });

  //     const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, 'IBTC', tab);

  //     userEvent.type(tabPanel.getByRole('textbox', { name: 'lend amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

  //     await waitFor(() => {
  //       expect(tabPanel.getByRole('textbox', { name: 'lend amount' })).toHaveErrorMessage('');
  //     });

  //     userEvent.click(tabPanel.getByRole('button', { name: /lend/i }));

  //     await waitFor(() => {
  //       expect(screen.getByRole('dialog')).toBeInTheDocument();
  //       expect(mockLend).not.toHaveBeenCalled();
  //     });
  //   });

  //   it('should not be able to lend due to lack of borrows and supply cap', async () => {
  //     mockGetLoanAssets.mockReturnValue({
  //       IBTC: {
  //         ...DEFAULT_IBTC_LOAN_ASSET,
  //         totalBorrows: DEFAULT_IBTC.MONETARY.VERY_LARGE,
  //         supplyCap: DEFAULT_IBTC.MONETARY.EMPTY
  //       }
  //     });

  //     await render(<App />, { path });

  //     const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, 'IBTC', tab);

  //     userEvent.type(tabPanel.getByRole('textbox', { name: 'lend amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

  //     await waitFor(() => {
  //       expect(tabPanel.getByRole('textbox', { name: 'lend amount' })).toHaveErrorMessage('');
  //     });

  //     userEvent.click(tabPanel.getByRole('button', { name: /lend/i }));

  //     await waitFor(() => {
  //       expect(screen.getByRole('dialog')).toBeInTheDocument();
  //       expect(mockLend).not.toHaveBeenCalled();
  //     });
  //   });
});
