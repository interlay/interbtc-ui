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
import { getModalTabPanel, withinModalTabPanel } from './utils';

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

  it.each([TABLES.BORROW.MARKET, TABLES.BORROW.POSITION])(
    'should be able open borrow modal using %s table',
    async (tableName) => {
      await render(<App />, { path });

      const tabPanel = getModalTabPanel(tableName, tab, 'IBTC');

      expect(tabPanel).toBeInTheDocument();
    }
  );

  it('should render LTV section', async () => {
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC');

    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();
  });

  it('should not render LTV section', async () => {
    mockGetLendPositionsOfAccount.mockReturnValue([{ ...DEFAULT_POSITIONS.LEND.IBTC, isCollateral: false }]);

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC');

    expect(tabPanel.queryByRole('meter', { name: /ltv meter/i })).not.toBeInTheDocument();
  });

  describe('Without collateral lend positions', () => {
    beforeEach(() => {
      mockGetLendPositionsOfAccount.mockReturnValue([{ ...DEFAULT_POSITIONS.LEND.IBTC, isCollateral: false }]);
    });

    it('should not be able to borrow', async () => {
      await render(<App />, { path });

      const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

      userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

      userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

      await waitFor(() => {
        expect(mockBorrow).not.toHaveBeenCalled();
      });
    });
  });

  describe('With lend positions', () => {
    describe('With one asset as collateral', () => {
      it('should be able to partially borrow', async () => {
        await render(<App />, { path });

        const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC');

        userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.SMALL);

        userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

        await waitForElementToBeRemoved(screen.getByRole('dialog'));

        expect(mockBorrow).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.SMALL);
      });

      it('should not be able to borrow', async () => {
        await render(<App />, { path });

        const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

        userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

        userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
          expect(mockBorrow).not.toHaveBeenCalled();
        });
      });
    });

    describe('With two assets as collateral', () => {
      beforeEach(() => {
        mockGetLendPositionsOfAccount.mockReturnValue([DEFAULT_POSITIONS.LEND.IBTC, DEFAULT_POSITIONS.LEND.INTR]);
      });

      it('should be able to partially borrow', async () => {
        await render(<App />, { path });

        const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC');

        userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.SMALL);

        userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

        await waitForElementToBeRemoved(screen.getByRole('dialog'));

        expect(mockBorrow).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.SMALL);
      });

      it('should not be able to borrow', async () => {
        await render(<App />, { path });

        const tabPanel = withinModalTabPanel(TABLES.BORROW.POSITION, tab, 'IBTC', true);

        userEvent.type(tabPanel.getByRole('textbox', { name: 'borrow amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

        userEvent.click(tabPanel.getByRole('button', { name: /borrow/i }));

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
          expect(mockBorrow).not.toHaveBeenCalled();
        });
      });
    });
  });
});
