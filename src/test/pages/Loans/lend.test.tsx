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
  mockLend
} from '@/test/mocks/@interlay/interbtc-api/parachain/loans';

import { render, screen, userEvent, waitFor, waitForElementToBeRemoved } from '../../test-utils';
import { TABLES } from './constants';
import { withinModalTabPanel } from './utils';

const path = '/lending';
const tab = 'lend';

describe.skip('Lending Flow', () => {
  beforeEach(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  afterAll(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  it('should be able to lend', async () => {
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC');

    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();

    userEvent.type(tabPanel.getByRole('textbox', { name: 'lend amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel.getByRole('button', { name: /lend/i })).not.toBeDisabled();
    });

    userEvent.click(tabPanel.getByRole('button', { name: /lend/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockLend).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.MEDIUM);
  });

  it('should not be able to lend over available balance', async () => {
    mockTokensBalance.emptyBalance();

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC');

    userEvent.type(tabPanel.getByRole('textbox', { name: 'lend amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'lend amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /lend/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockLend).not.toHaveBeenCalled();
    });

    mockTokensBalance.mockRestore();
  });
});
