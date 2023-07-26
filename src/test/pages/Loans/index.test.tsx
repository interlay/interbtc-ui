import '@testing-library/jest-dom';

import App from '@/App';
import { MOCK_LOANS } from '@/test/mocks/@interlay/interbtc-api';

import { render, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from '../../test-utils';
import { getTableRow, withinTable } from '../utils/table';
import { getFeeTokenSelect, waitForFeeEstimate, waitForTransactionExecute } from '../utils/transaction';
import { TABLES } from './constants';

const {
  getBorrowPositionsOfAccount,
  getLendPositionsOfAccount,
  getLoanAssets,
  getLendingStats,
  claimAllSubsidyRewards,
  getAccruedRewardsOfAccount
} = MOCK_LOANS.MODULE;
const { LOAN_POSITIONS, ASSETS, LENDING_STATS, ACCOUNT_REWARDS } = MOCK_LOANS.DATA;

const path = '/lending';

describe('Loans page', () => {
  beforeEach(() => {
    getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.EMPTY);
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.EMPTY);
    getLoanAssets.mockReturnValue(ASSETS.NORMAL);
    getLendingStats.mockReturnValue(LENDING_STATS.LOW_LTV);
  });

  describe('Tables Section', () => {
    it.each([TABLES.LEND.MARKET, TABLES.BORROW.MARKET])(
      'should not be able to open inactive market on %s table',
      async (tableName) => {
        getLoanAssets.mockReturnValue(ASSETS.INACTIVE);

        await render(<App />, { path });

        const row = getTableRow(tableName, 'IBTC');

        userEvent.click(row);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      }
    );

    it.each([TABLES.LEND.POSITION, TABLES.BORROW.POSITION])('should not display %s table', async (tableName) => {
      await render(<App />, { path });

      expect(screen.queryByRole('grid', { name: new RegExp(tableName, 'i') })).not.toBeInTheDocument();
    });

    it('should not display my borrow positions table but instead a placeholder', async () => {
      getLendPositionsOfAccount.mockResolvedValue(LOAN_POSITIONS.LEND.AVERAGE);

      await render(<App />, { path });

      const table = withinTable(TABLES.BORROW.POSITION);

      expect(table.queryAllByRole('row')).toHaveLength(0);
      expect(screen.getByText(/no borrow positions/i)).toBeInTheDocument();
    });
  });

  describe('LTV Section', () => {
    it('should not render when there no positions open', async () => {
      await render(<App />, { path });

      expect(screen.queryByRole('meter', { name: /ltv meter/i })).not.toBeInTheDocument();
    });

    it('should not render when there is a non-collateral lend position', async () => {
      getLendPositionsOfAccount.mockResolvedValue(LOAN_POSITIONS.LEND.AVERAGE);

      await render(<App />, { path });

      expect(screen.queryByRole('meter', { name: /ltv meter/i })).not.toBeInTheDocument();
    });

    it('should render when there is a lend position as collateral', async () => {
      getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.AVERAGE_COLLATERAL);

      await render(<App />, { path });

      expect(screen.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();
      expect(screen.getByText(/borrow balance/i)).toBeInTheDocument();
      expect(screen.getByText(/collateral balance/i)).toBeInTheDocument();
      expect(screen.getByText(/loan status/i)).toBeInTheDocument();
    });

    it('should display low risk', async () => {
      getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.FULL_COLLATERAL);
      getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.AVERAGE);

      await render(<App />, { path });

      expect(screen.getByText(/low risk/i)).toBeInTheDocument();
    });

    it('should display medium risk', async () => {
      getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.FULL_COLLATERAL);
      getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.AVERAGE);
      getLendingStats.mockReturnValue(LENDING_STATS.MEDIUM_LTV);

      await render(<App />, { path });

      expect(screen.getByText(/medium risk/i)).toBeInTheDocument();
    });

    it('should display liquidation risk', async () => {
      getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.FULL_COLLATERAL);
      getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.AVERAGE);
      getLendingStats.mockReturnValue(LENDING_STATS.HIGH_LTV);

      await render(<App />, { path });

      expect(screen.getByText(/liquidation risk/i)).toBeInTheDocument();
    });
  });

  describe('Rewards', () => {
    it('should be able to claim', async () => {
      getAccruedRewardsOfAccount.mockResolvedValue(ACCOUNT_REWARDS.FULL);

      await render(<App />, { path });

      userEvent.click(screen.getByRole('button', { name: /claim/i }));

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /claim rewards/i })).toBeInTheDocument();
      });

      await waitForFeeEstimate(claimAllSubsidyRewards);

      const modal = within(screen.getByRole('dialog', { name: /claim rewards/i }));

      expect(getFeeTokenSelect(modal)).toBeInTheDocument();

      userEvent.click(modal.getByRole('button', { name: /claim rewards/i }));

      await waitForElementToBeRemoved(screen.getByRole('dialog', { name: /claim rewards/i }));

      await waitForTransactionExecute(claimAllSubsidyRewards);
    });

    it('should not be able to claim', async () => {
      getAccruedRewardsOfAccount.mockResolvedValue(ACCOUNT_REWARDS.EMPTY);

      await render(<App />, { path });

      expect(screen.queryByRole('button', { name: /claim/i })).not.toBeInTheDocument();
    });
  });
});
