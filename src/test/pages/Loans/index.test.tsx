import '@testing-library/jest-dom';

import App from '@/App';
import { MOCK_LOANS } from '@/test/mocks/@interlay/interbtc-api';

import { render, screen, userEvent } from '../../test-utils';
import { getTableRow, withinTable } from '../utils/table';
import { TABLES } from './constants';

const { getBorrowPositionsOfAccount, getLendPositionsOfAccount, getLoanAssets, getLendingStats } = MOCK_LOANS.MODULE;
const { LOAN_POSITIONS, ASSETS, LENDING_STATS, INACTIVE_ASSETS } = MOCK_LOANS.DATA;

const path = '/lending';

describe('Loans page', () => {
  beforeEach(() => {
    getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.EMPTY);
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.EMPTY);
    getLoanAssets.mockReturnValue(ASSETS);
    getLendingStats.mockReturnValue(LENDING_STATS.LOW_LTV);
  });

  describe('Tables Section', () => {
    it.each([TABLES.LEND.MARKET, TABLES.BORROW.MARKET])(
      'should not be able to open inactive market on %s table',
      async (tableName) => {
        getLoanAssets.mockReturnValue(INACTIVE_ASSETS);

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

    it.only('should display low risk', async () => {
      getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.FULL_COLLATERAL);
      getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.AVERAGE);

      await render(<App />, { path });

      expect(screen.getByText(/low risk/i)).toBeInTheDocument();
    });

    // it('should display medium risk', async () => {
    //   mockGetLendingStats.mockReturnValue({
    //     ...DEFAULT_LENDING_STATS,
    //     collateralThresholdWeightedAverage: new Big(0.5),
    //     liquidationThresholdWeightedAverage: new Big(0.75),
    //     ltv: new Big(0.5)
    //   });

    //   await render(<App />, { path });

    //   expect(screen.getByText(/medium risk/i)).toBeInTheDocument();
    // });

    // it('should display liquidation risk', async () => {
    //   mockGetLendingStats.mockReturnValue({
    //     ...DEFAULT_LENDING_STATS,
    //     collateralThresholdWeightedAverage: new Big(0.5),
    //     liquidationThresholdWeightedAverage: new Big(0.75),
    //     ltv: new Big(0.75)
    //   });

    //   await render(<App />, { path });

    //   expect(screen.getByText(/liquidation risk/i)).toBeInTheDocument();
    // });
  });

  // describe('Rewards', () => {
  //   it('should be able to claim', async () => {
  //     await render(<App />, { path });

  //     userEvent.click(screen.getByRole('button', { name: /claim/i }));

  //     await waitFor(() => expect(mockClaimAllSubsidyRewards).toHaveBeenCalledTimes(1));
  //   });

  //   it('should not be able to claim', async () => {
  //     mockGetAccountSubsidyRewards.mockReturnValue(newMonetaryAmount(0, GOVERNANCE_TOKEN));

  //     await render(<App />, { path });

  //     expect(screen.queryByRole('button', { name: /claim/i })).not.toBeInTheDocument();
  //   });
  // });
});
