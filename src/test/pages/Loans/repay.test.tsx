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
import { getModalTabPanel, withinModalTabPanel } from './utils';

jest.mock('../../../parts/Layout', () => {
  return ({ children }: any) => children;
});

const path = '/lending';
const tab = 'repay';

describe('Repay Flow', () => {
  beforeEach(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  afterAll(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  it.each([TABLES.BORROW.MARKET, TABLES.BORROW.POSITION])(
    'should be able open repay modal using %s table',
    async (tableName) => {
      await render(<App />, { path });

      const tabPanel = getModalTabPanel(tableName, tab, 'IBTC', true);

      expect(tabPanel).toBeInTheDocument();
    }
  );

  it('should render LTV section when asset has borrow position', async () => {
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();
  });

  it('should render LTV section when asset doesnot have borrow position', async () => {
    mockGetBorrowPositionsOfAccount.mockReturnValue([]);

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.MARKET, tab, 'IBTC', true);

    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();
  });

  it('should be able to partially repay', async () => {
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'repay amount' }), DEFAULT_IBTC.AMOUNT.SMALL);

    userEvent.click(tabPanel.getByRole('button', { name: /repay/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockRepay).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.SMALL);
  });

  it('should be able to repay all', async () => {
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    userEvent.click(
      tabPanel.getByRole('button', {
        name: /apply balance/i
      })
    );

    userEvent.click(tabPanel.getByRole('button', { name: /repay/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockRepayAll).toHaveBeenCalledWith(WRAPPED_TOKEN);
  });

  it('should not be able to repay over available balance', async () => {
    mockTokensBalance.emptyBalance();

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

    userEvent.type(tabPanel.getByRole('textbox', { name: 'repay amount' }), DEFAULT_IBTC.AMOUNT.VERY_LARGE);

    userEvent.click(tabPanel.getByRole('button', { name: /repay/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockRepay).not.toHaveBeenCalled();
    });

    mockTokensBalance.mockRestore();
  });
});
