import '@testing-library/jest-dom';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import {
  DEFAULT_BORROW_POSITIONS,
  DEFAULT_IBTC,
  DEFAULT_LEND_POSITIONS,
  DEFAULT_POSITIONS,
  mockBorrow,
  mockGetBorrowPositionsOfAccount,
  mockGetLendPositionsOfAccount
} from '@/test/mocks/@interlay/interbtc-api/parachain/loans';

import { render, screen, userEvent, waitFor, waitForElementToBeRemoved } from '../../test-utils';
import { TABLES } from './constants';
import { withinModalTabPanel } from './utils';

jest.mock('../../../parts/Layout', () => {
  return ({ children }: any) => children;
});

const path = '/lending';
const tab = 'borrow';

describe('Borrow Flow', () => {
  beforeEach(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  afterAll(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  it('should be able to borrow', async () => {
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC');

    userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.SMALL);

    await waitFor(() => {
      expect(tabPanel.getByRole('button', { name: /borrow/i })).not.toBeDisabled();
    });

    userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockBorrow).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.SMALL);
  });

  it.only('should not be able to borrow', async () => {
    // SCENARIO: use has collateral but is not enought to cover what he wants to borrow
    const { unmount } = await render(<App />, { path });

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

    unmount();

    // SCENARIO: if there is not collateral, user should not be able to borrow
    mockGetLendPositionsOfAccount.mockReturnValue([{ ...DEFAULT_POSITIONS.LEND.IBTC, isCollateral: false }]);

    await render(<App />, { path });

    const tabPanel2 = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    // If there is no collateral, modal LTV meter should not render
    expect(tabPanel2.queryByRole('meter', { name: /ltv meter/i })).not.toBeInTheDocument();

    userEvent.type(tabPanel2.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel2.getByRole('textbox', { name: 'borrow amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel2.getByRole('button', { name: /borrow/i }));

    await waitFor(() => {
      expect(mockBorrow).not.toHaveBeenCalled();
    });
  });
});
