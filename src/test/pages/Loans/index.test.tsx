import '@testing-library/jest-dom';

import { newMonetaryAmount } from '@interlay/interbtc-api';
import Big from 'big.js';

import App from '@/App';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import {
  DEFAULT_ASSETS,
  DEFAULT_BORROW_POSITIONS,
  DEFAULT_LEND_POSITIONS,
  DEFAULT_LENDING_STATS,
  DEFAULT_POSITIONS,
  mockClaimAllSubsidyRewards,
  mockGetAccountSubsidyRewards,
  mockGetBorrowPositionsOfAccount,
  mockGetLendingStats,
  mockGetLendPositionsOfAccount,
  mockGetLoanAssets
} from '@/test/mocks/@interlay/interbtc-api/parachain/loans';

import { render, screen, userEvent, waitFor } from '../../test-utils';
import { getTableRow, withinTable } from '../utils/table';
import { TABLES } from './constants';

const path = '/lending';

describe.skip('Loans page', () => {
  beforeEach(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
    mockGetLoanAssets.mockReturnValue(DEFAULT_ASSETS);
    mockGetLendingStats.mockReturnValue(DEFAULT_LENDING_STATS);
  });

  describe('Tables Section', () => {
    it.each([TABLES.LEND.MARKET, TABLES.BORROW.MARKET])(
      'should not be able to open inactive market on %s table',
      async (tableName) => {
        mockGetLoanAssets.mockReturnValue({ IBTC: { ...DEFAULT_ASSETS.IBTC, isActive: false } });

        await render(<App />, { path });

        const row = getTableRow(tableName, 'IBTC');

        userEvent.click(row);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      }
    );

    it.each([TABLES.LEND.POSITION, TABLES.BORROW.POSITION])('should not display %s table', async (tableName) => {
      mockGetBorrowPositionsOfAccount.mockReturnValue([]);
      mockGetLendPositionsOfAccount.mockReturnValue([]);

      await render(<App />, { path });

      expect(screen.queryByRole('grid', { name: new RegExp(tableName, 'i') })).not.toBeInTheDocument();
    });

    it('should not display my borrow positions table but instead a placeholder', async () => {
      mockGetBorrowPositionsOfAccount.mockReturnValue([]);

      await render(<App />, { path });

      const table = withinTable(TABLES.BORROW.POSITION);

      expect(table.queryAllByRole('row')).toHaveLength(0);
      expect(screen.getByText(/no borrow positions/i)).toBeInTheDocument();
    });
  });

  describe('LTV Section', () => {
    it('should not render when there no positions open', async () => {
      mockGetBorrowPositionsOfAccount.mockReturnValue([]);
      mockGetLendPositionsOfAccount.mockReturnValue([]);

      await render(<App />, { path });

      expect(screen.queryByRole('meter', { name: /ltv meter/i })).not.toBeInTheDocument();
    });

    it('should not render when there is a non-collateral lend position', async () => {
      mockGetBorrowPositionsOfAccount.mockReturnValue([]);
      mockGetLendPositionsOfAccount.mockReturnValue([{ ...DEFAULT_POSITIONS.LEND.IBTC, isCollateral: false }]);

      await render(<App />, { path });

      expect(screen.queryByRole('meter', { name: /ltv meter/i })).not.toBeInTheDocument();
    });

    it('should render when there is a lend position as collateral', async () => {
      mockGetBorrowPositionsOfAccount.mockReturnValue([]);
      mockGetLendPositionsOfAccount.mockReturnValue([DEFAULT_POSITIONS.LEND.IBTC]);

      await render(<App />, { path });

      expect(screen.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();
      expect(screen.getByText(/borrow balance/i)).toBeInTheDocument();
      expect(screen.getByText(/collateral balance/i)).toBeInTheDocument();
      expect(screen.getByText(/loan status/i)).toBeInTheDocument();
    });

    it('should display low risk', async () => {
      await render(<App />, { path });

      expect(screen.getByText(/low risk/i)).toBeInTheDocument();
    });

    it('should display medium risk', async () => {
      mockGetLendingStats.mockReturnValue({
        ...DEFAULT_LENDING_STATS,
        collateralThresholdWeightedAverage: new Big(0.5),
        liquidationThresholdWeightedAverage: new Big(0.75),
        ltv: new Big(0.5)
      });

      await render(<App />, { path });

      expect(screen.getByText(/medium risk/i)).toBeInTheDocument();
    });

    it('should display liquidation risk', async () => {
      mockGetLendingStats.mockReturnValue({
        ...DEFAULT_LENDING_STATS,
        collateralThresholdWeightedAverage: new Big(0.5),
        liquidationThresholdWeightedAverage: new Big(0.75),
        ltv: new Big(0.75)
      });

      await render(<App />, { path });

      expect(screen.getByText(/liquidation risk/i)).toBeInTheDocument();
    });
  });

  describe('Rewards', () => {
    it('should be able to claim', async () => {
      await render(<App />, { path });

      userEvent.click(screen.getByRole('button', { name: /claim/i }));

      await waitFor(() => expect(mockClaimAllSubsidyRewards).toHaveBeenCalledTimes(1));
    });

    it('should not be able to claim', async () => {
      mockGetAccountSubsidyRewards.mockReturnValue(newMonetaryAmount(0, GOVERNANCE_TOKEN));

      await render(<App />, { path });

      expect(screen.queryByRole('button', { name: /claim/i })).not.toBeInTheDocument();
    });
  });
});
