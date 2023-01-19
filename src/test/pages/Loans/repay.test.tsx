import '@testing-library/jest-dom';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { mockTokensBalance } from '@/test/mocks/@interlay/interbtc-api';
import {
  DEFAULT_BORROW_POSITIONS,
  DEFAULT_IBTC,
  DEFAULT_LEND_POSITIONS,
  mockGetBorrowPositionsOfAccount,
  mockGetLendPositionsOfAccount,
  mockRepay,
  mockRepayAll
} from '@/test/mocks/@interlay/interbtc-api/parachain/loans';

import { render, screen, userEvent, waitFor, waitForElementToBeRemoved } from '../../test-utils';
import { TABLES } from './constants';
import { withinModalTabPanel } from './utils';

const path = '/lending';
const tab = 'repay';

describe.skip('Repay Flow', () => {
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
    const { unmount } = await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    // should render modal with ltv meter
    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();

    userEvent.type(tabPanel.getByRole('textbox', { name: 'repay amount' }), DEFAULT_IBTC.AMOUNT.SMALL);

    await waitFor(() => {
      expect(tabPanel.getByRole('button', { name: /repay/i })).not.toBeDisabled();
    });

    userEvent.click(tabPanel.getByRole('button', { name: /repay/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockRepay).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.SMALL);

    unmount();

    // SCENARIO: user is totally repaying loan
    await render(<App />, { path });

    const tabPanel2 = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    userEvent.click(
      tabPanel2.getByRole('button', {
        name: /apply balance/i
      })
    );

    await waitFor(() => {
      expect(tabPanel2.getByRole('button', { name: /repay/i })).not.toBeDisabled();
    });

    userEvent.click(tabPanel2.getByRole('button', { name: /repay/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

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

    mockTokensBalance.mockRestore();
  });
});
