import '@testing-library/jest-dom';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { mockTokensBalance } from '@/test/mocks/@interlay/interbtc-api';
import {
  DEFAULT_BORROW_POSITIONS,
  DEFAULT_IBTC,
  DEFAULT_LEND_POSITIONS,
  DEFAULT_POSITIONS,
  mockGetBorrowPositionsOfAccount,
  mockGetLendPositionsOfAccount,
  mockLend
} from '@/test/mocks/@interlay/interbtc-api/parachain/loans';

import { render, screen, userEvent, waitFor, waitForElementToBeRemoved } from '../../test-utils';
import { TABLES } from './constants';
import { getModalTabPanel, withinModalTabPanel } from './utils';

jest.mock('../../../parts/Layout', () => {
  return ({ children }: any) => children;
});

const path = '/lending';
const tab = 'lend';

describe('Lending Flow', () => {
  beforeEach(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  afterAll(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  it.each([TABLES.LEND.MARKET, TABLES.LEND.POSITION])(
    'should be able open lend modal using %s table',
    async (tableName) => {
      await render(<App />, { path });

      const tabPanel = getModalTabPanel(tableName, tab, 'IBTC');

      expect(tabPanel).toBeInTheDocument();
    }
  );

  it('should render LTV section', async () => {
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC');

    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();
  });

  it('should not render LTV section', async () => {
    mockGetLendPositionsOfAccount.mockReturnValue([{ ...DEFAULT_POSITIONS.LEND.IBTC, isCollateral: false }]);

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC');

    expect(tabPanel.queryByRole('meter', { name: /ltv meter/i })).not.toBeInTheDocument();
  });

  it('should be able to lend', async () => {
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC');

    userEvent.type(tabPanel.getByRole('textbox', { name: 'lend amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    userEvent.click(tabPanel.getByRole('button', { name: /lend/i }));

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(mockLend).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.MEDIUM);
  });

  it('should not be able to lend over available balance', async () => {
    mockTokensBalance.emptyBalance();

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC');

    userEvent.type(tabPanel.getByRole('textbox', { name: 'lend amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    userEvent.click(tabPanel.getByRole('button', { name: /lend/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockLend).not.toHaveBeenCalled();
    });

    mockTokensBalance.mockRestore();
  });
});
