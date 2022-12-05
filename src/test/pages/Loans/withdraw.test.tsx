import '@testing-library/jest-dom';

import App from '@/App';
import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import {
  DEFAULT_BORROW_POSITIONS,
  DEFAULT_IBTC,
  DEFAULT_LEND_POSITIONS,
  DEFAULT_POSITIONS,
  mockGetBorrowPositionsOfAccount,
  mockGetLendPositionsOfAccount,
  mockWithdraw,
  mockWithdrawAll
} from '@/test/mocks/@interlay/interbtc-api/parachain/loans';

import { render, screen, userEvent, waitFor, waitForElementToBeRemoved } from '../../test-utils';
import { TABLES } from './constants';
import { getModalTabPanel, withinModalTabPanel } from './utils';

jest.mock('../../../parts/Layout', () => {
  return ({ children }: any) => children;
});

const path = '/lending';
const tab = 'withdraw';

describe('Withdraw Flow', () => {
  beforeEach(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  afterAll(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  it.each([TABLES.LEND.MARKET, TABLES.LEND.POSITION])(
    'should be able open withdraw modal using %s table',
    async (tableName) => {
      await render(<App />, { path });

      const tabPanel = getModalTabPanel(tableName, tab, 'IBTC', true);

      expect(tabPanel).toBeInTheDocument();
    }
  );

  it('should render LTV section', async () => {
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();
  });

  it('should not render LTV section', async () => {
    mockGetLendPositionsOfAccount.mockReturnValue([{ ...DEFAULT_POSITIONS.LEND.IBTC, isCollateral: false }]);

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

    expect(tabPanel.queryByRole('meter', { name: /ltv meter/i })).not.toBeInTheDocument();
  });

  describe('Without borrow positions', () => {
    beforeEach(() => {
      mockGetBorrowPositionsOfAccount.mockReturnValue([]);
    });

    it('should be able to partially withdraw', async () => {
      await render(<App />, { path });

      const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

      userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

      userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

      await waitForElementToBeRemoved(screen.getByRole('dialog'));

      expect(mockWithdraw).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.MEDIUM);
    });

    it('should be able to withdraw all', async () => {
      await render(<App />, { path });

      const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

      userEvent.click(
        tabPanel.getByRole('button', {
          name: /apply balance/i
        })
      );

      userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

      await waitForElementToBeRemoved(screen.getByRole('dialog'));

      expect(mockWithdrawAll).toHaveBeenCalledWith(WRAPPED_TOKEN);
    });
  });

  describe('With borrow positions', () => {
    describe('With one asset as collateral', () => {
      it('should be able to partially withdraw', async () => {
        await render(<App />, { path });

        const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

        userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.SMALL);

        userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

        await waitForElementToBeRemoved(screen.getByRole('dialog'));

        expect(mockWithdraw).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.SMALL);
      });

      it('should not be able to partially withdraw', async () => {
        await render(<App />, { path });

        const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

        userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

        userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
          expect(mockWithdraw).not.toHaveBeenCalled();
        });
      });

      it('should not be able to withdraw all', async () => {
        await render(<App />, { path });

        const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

        userEvent.click(
          tabPanel.getByRole('button', {
            name: /apply balance/i
          })
        );
        userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
          expect(mockWithdrawAll).not.toHaveBeenCalled();
        });
      });
    });

    describe('With two assets as collateral', () => {
      beforeEach(() => {
        mockGetLendPositionsOfAccount.mockReturnValue([DEFAULT_POSITIONS.LEND.IBTC, DEFAULT_POSITIONS.LEND.INTR]);
      });

      it('should be able to partially withdraw', async () => {
        await render(<App />, { path });

        const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

        userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.SMALL);

        userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

        await waitForElementToBeRemoved(screen.getByRole('dialog'));

        expect(mockWithdraw).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.SMALL);
      });

      it('should not be able to partially withdraw', async () => {
        await render(<App />, { path });

        const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

        userEvent.type(tabPanel.getByRole('textbox', { name: 'withdraw amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

        userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
          expect(mockWithdraw).not.toHaveBeenCalled();
        });
      });

      it('should be able to withdraw all', async () => {
        mockGetLendPositionsOfAccount.mockReturnValue([DEFAULT_POSITIONS.LEND.IBTC, DEFAULT_POSITIONS.LEND.INTR]);

        await render(<App />, { path });

        const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'INTR', true);

        userEvent.click(
          tabPanel.getByRole('button', {
            name: /apply balance/i
          })
        );

        userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

        await waitForElementToBeRemoved(screen.getByRole('dialog'));

        expect(mockWithdrawAll).toHaveBeenCalledWith(GOVERNANCE_TOKEN);
      });

      it('should not be able to withdraw all', async () => {
        await render(<App />, { path });

        const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC', true);

        userEvent.click(
          tabPanel.getByRole('button', {
            name: /apply balance/i
          })
        );
        userEvent.click(tabPanel.getByRole('button', { name: /withdraw/i }));

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
          expect(mockWithdrawAll).not.toHaveBeenCalled();
        });
      });
    });
  });
});
