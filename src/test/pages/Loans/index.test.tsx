import '@testing-library/jest-dom';

import App from '@/App';
import { MOCK_LOANS } from '@/test/mocks/@interlay/interbtc-api';

import { render, screen, userEvent } from '../../test-utils';
import { getTableRow } from '../utils/table';
import { TABLES } from './constants';

const { getBorrowPositionsOfAccount, getLendPositionsOfAccount, getLoanAssets, getLendingStats } = MOCK_LOANS.MODULE;
const { LOAN_POSITIONS, ASSETS, LENDING_STATS, INACTIVE_ASSETS } = MOCK_LOANS.DATA;

const path = '/lending';

describe('Loans page', () => {
  beforeEach(() => {
    getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.EMPTY);
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.EMPTY);
    getLoanAssets.mockReturnValue(ASSETS);
    getLendingStats.mockReturnValue(LENDING_STATS);
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

    //   it.each([TABLES.LEND.POSITION, TABLES.BORROW.POSITION])('should not display %s table', async (tableName) => {
    //     mockGetBorrowPositionsOfAccount.mockReturnValue([]);
    //     mockGetLendPositionsOfAccount.mockReturnValue([]);

    //     await render(<App />, { path });

    //     expect(screen.queryByRole('grid', { name: new RegExp(tableName, 'i') })).not.toBeInTheDocument();
    //   });

    //   it('should not display my borrow positions table but instead a placeholder', async () => {
    //     mockGetBorrowPositionsOfAccount.mockReturnValue([]);

    //     await render(<App />, { path });

    //     const table = withinTable(TABLES.BORROW.POSITION);

    //     expect(table.queryAllByRole('row')).toHaveLength(0);
    //     expect(screen.getByText(/no borrow positions/i)).toBeInTheDocument();
    //   });
    // });

    // describe('LTV Section', () => {
    //   it('should not render when there no positions open', async () => {
    //     mockGetBorrowPositionsOfAccount.mockReturnValue([]);
    //     mockGetLendPositionsOfAccount.mockReturnValue([]);

    //     await render(<App />, { path });

    //     expect(screen.queryByRole('meter', { name: /ltv meter/i })).not.toBeInTheDocument();
    //   });

    //   it('should not render when there is a non-collateral lend position', async () => {
    //     mockGetBorrowPositionsOfAccount.mockReturnValue([]);
    //     mockGetLendPositionsOfAccount.mockReturnValue([{ ...DEFAULT_POSITIONS.LEND.IBTC, isCollateral: false }]);

    //     await render(<App />, { path });

    //     expect(screen.queryByRole('meter', { name: /ltv meter/i })).not.toBeInTheDocument();
    //   });

    //   it('should render when there is a lend position as collateral', async () => {
    //     mockGetBorrowPositionsOfAccount.mockReturnValue([]);
    //     mockGetLendPositionsOfAccount.mockReturnValue([DEFAULT_POSITIONS.LEND.IBTC]);

    //     await render(<App />, { path });

    //     expect(screen.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();
    //     expect(screen.getByText(/borrow balance/i)).toBeInTheDocument();
    //     expect(screen.getByText(/collateral balance/i)).toBeInTheDocument();
    //     expect(screen.getByText(/loan status/i)).toBeInTheDocument();
    //   });

    //   it('should display low risk', async () => {
    //     await render(<App />, { path });

    //     expect(screen.getByText(/low risk/i)).toBeInTheDocument();
    //   });

    //   it('should display medium risk', async () => {
    //     mockGetLendingStats.mockReturnValue({
    //       ...DEFAULT_LENDING_STATS,
    //       collateralThresholdWeightedAverage: new Big(0.5),
    //       liquidationThresholdWeightedAverage: new Big(0.75),
    //       ltv: new Big(0.5)
    //     });

    //     await render(<App />, { path });

    //     expect(screen.getByText(/medium risk/i)).toBeInTheDocument();
    //   });

    //   it('should display liquidation risk', async () => {
    //     mockGetLendingStats.mockReturnValue({
    //       ...DEFAULT_LENDING_STATS,
    //       collateralThresholdWeightedAverage: new Big(0.5),
    //       liquidationThresholdWeightedAverage: new Big(0.75),
    //       ltv: new Big(0.75)
    //     });

    //     await render(<App />, { path });

    //     expect(screen.getByText(/liquidation risk/i)).toBeInTheDocument();
    //   });
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
