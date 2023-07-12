import MatchMediaMock from 'jest-matchmedia-mock';

import App from '@/App';
import { theme } from '@/component-library';
import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { NATIVE_CURRENCIES } from '@/utils/constants/currency';
import { PAGES, QUERY_PARAMETERS } from '@/utils/constants/links';

import { MOCK_AMM, MOCK_API, MOCK_LOANS, MOCK_SYSTEM } from '../mocks/@interlay/interbtc-api';
import {
  DEFAULT_STAKED_BALANCE,
  EMPTY_STAKED_BALANCE,
  mockGetStakedBalance
} from '../mocks/@interlay/interbtc-api/parachain/escrow';
import { render, screen, userEvent, waitFor } from '../test-utils';
import { withinList } from './utils/list';
import { queryTable, withinTable, withinTableRow } from './utils/table';

jest.mock('@/pages/Swap', () => ({ __esModule: true, default: () => <div>Swap page</div> }));

const { getLpTokens, getLiquidityProvidedByAccount } = MOCK_AMM.MODULE;
const { getCurrentBlockNumber } = MOCK_SYSTEM.MODULE;
const { getLendPositionsOfAccount, getBorrowPositionsOfAccount } = MOCK_LOANS.MODULE;
const { claimVesting, vestingSchedules } = MOCK_API.MODULE;

const { ACCOUNT_LIQUIDITY } = MOCK_AMM.DATA;
const { BLOCK_NUMBER } = MOCK_SYSTEM.DATA;
const { LOAN_POSITIONS } = MOCK_LOANS.DATA;
const { VESTING_SCHEDULES } = MOCK_API.DATA;

const path = '/wallet';

const TABLES = {
  AVAILABLE_ASSETS: 'available assets',
  LEND_POSITIONS: 'lend positions',
  BORROW_POSITIONS: 'borrow positions',
  LIQUIDITY_POOLS: 'liquidity pools',
  STAKED: 'staked'
};

describe('Wallet Page', () => {
  let matchMedia: MatchMediaMock;

  beforeEach(() => {
    matchMedia = new MatchMediaMock();

    // ignoring lp-tokens
    getLpTokens.mockResolvedValue([]);
    getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.AVERAGE);
    getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.AVERAGE);
    getLiquidityProvidedByAccount.mockReturnValue(ACCOUNT_LIQUIDITY.EMPTY);
    mockGetStakedBalance.mockReturnValue(DEFAULT_STAKED_BALANCE);
    getCurrentBlockNumber.mockReturnValue(BLOCK_NUMBER.CURRENT);
    vestingSchedules.mockReturnValue(VESTING_SCHEDULES.EMPTY);
  });

  afterEach(() => {
    matchMedia.clear();
  });

  // TODO: add tests for Transfer CTALinks
  describe('Available Assets', () => {
    it('should render table (desktop)', async () => {
      await render(<App />, { path });

      const table = withinTable(TABLES.AVAILABLE_ASSETS);

      expect(table.getAllByRole('row')).toHaveLength(NATIVE_CURRENCIES.length);
    });

    it('should render list (mobile)', async () => {
      matchMedia.useMediaQuery(theme.breakpoints.down('md'));

      await render(<App />, { path });

      const list = withinList(TABLES.AVAILABLE_ASSETS);

      expect(list.getAllByRole('row')).toHaveLength(NATIVE_CURRENCIES.length);
    });

    it('should be able to navigate to issue page', async () => {
      const { history } = await render(<App />, { path });

      const row = withinTableRow(TABLES.AVAILABLE_ASSETS, WRAPPED_TOKEN.ticker);

      userEvent.click(row.getByRole('link', { name: /issue/i }));

      expect(history.location.pathname).toBe(PAGES.BTC);
      expect(history.location.search).toMatch(`${QUERY_PARAMETERS.TAB}=issue`);
    });

    it('should be able to open buy dialog', async () => {
      await render(<App />, { path });

      const row = withinTableRow(TABLES.AVAILABLE_ASSETS, GOVERNANCE_TOKEN.ticker);

      userEvent.click(row.getByRole('button', { name: /buy/i }));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it.only('should be able to claim vesting', async () => {
      getCurrentBlockNumber.mockReturnValue(10);
      vestingSchedules.mockReturnValue(VESTING_SCHEDULES.FULL);

      await render(<App />, { path });

      const row = withinTableRow(TABLES.AVAILABLE_ASSETS, GOVERNANCE_TOKEN.ticker);

      userEvent.click(row.getByRole('button', { name: /claim vesting/i }));

      await waitFor(() => {
        expect(claimVesting).toHaveBeenCalledTimes(1);
      });
    });

    it(`should be able to navigate to swap page using ${WRAPPED_TOKEN.ticker}`, async () => {
      const { history } = await render(<App />, { path });

      const row = withinTableRow(TABLES.AVAILABLE_ASSETS, WRAPPED_TOKEN.ticker);

      userEvent.click(row.getByRole('link', { name: /swap/i }));

      expect(history.location.pathname).toBe(PAGES.SWAP);
      expect(history.location.search).toMatch(`${QUERY_PARAMETERS.SWAP.FROM}=${WRAPPED_TOKEN.ticker}`);
    });

    it(`should be able to navigate to swap page using ${RELAY_CHAIN_NATIVE_TOKEN.ticker}`, async () => {
      const { history } = await render(<App />, { path });

      const row = withinTableRow(TABLES.AVAILABLE_ASSETS, RELAY_CHAIN_NATIVE_TOKEN.ticker);

      userEvent.click(row.getByRole('link', { name: /swap/i }));

      expect(history.location.pathname).toBe(PAGES.SWAP);
      expect(history.location.search).toMatch(
        `${QUERY_PARAMETERS.SWAP.FROM}=${RELAY_CHAIN_NATIVE_TOKEN.ticker}&${QUERY_PARAMETERS.SWAP.TO}=${WRAPPED_TOKEN.ticker}`
      );
    });

    it('should display all balance assets', async () => {
      await render(<App />, { path });

      const table = withinTable(TABLES.AVAILABLE_ASSETS);

      expect(table.getAllByRole('row')).toHaveLength(NATIVE_CURRENCIES.length);

      userEvent.click(screen.getByRole('switch', { name: /show all/i }));

      await waitFor(() => {
        expect(table.queryAllByRole('row')).toHaveLength(NATIVE_CURRENCIES.length);
      });
    });
  });

  describe('Lending Positions', () => {
    it('should display table', async () => {
      getLendPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.LEND.AVERAGE);

      await render(<App />, { path });

      const table = withinTable(TABLES.LEND_POSITIONS);

      expect(table.getAllByRole('row')).toHaveLength(LOAN_POSITIONS.LEND.AVERAGE.length);
    });

    it('should not display table', async () => {
      getLendPositionsOfAccount.mockResolvedValue([]);

      await render(<App />, { path });

      expect(queryTable(TABLES.LEND_POSITIONS)).not.toBeInTheDocument();
    });
  });

  describe('Borrow Positions', () => {
    it('should display table', async () => {
      getBorrowPositionsOfAccount.mockReturnValue(LOAN_POSITIONS.BORROW.AVERAGE);

      await render(<App />, { path });

      const table = withinTable(TABLES.BORROW_POSITIONS);

      expect(table.getAllByRole('row')).toHaveLength(LOAN_POSITIONS.BORROW.AVERAGE.length);
    });

    it('should not display table', async () => {
      getBorrowPositionsOfAccount.mockReturnValue([]);

      await render(<App />, { path });

      expect(queryTable(TABLES.BORROW_POSITIONS)).not.toBeInTheDocument();
    });
  });

  describe('Liquidity Pools', () => {
    it('should display table', async () => {
      getLiquidityProvidedByAccount.mockResolvedValue(ACCOUNT_LIQUIDITY.FULL);

      await render(<App />, { path });

      const table = withinTable(TABLES.LIQUIDITY_POOLS);

      expect(table.getAllByRole('row')).toHaveLength(ACCOUNT_LIQUIDITY.FULL.length);
    });

    it('should not display table', async () => {
      getLiquidityProvidedByAccount.mockReturnValue(ACCOUNT_LIQUIDITY.EMPTY);

      await render(<App />, { path });

      expect(queryTable(TABLES.LIQUIDITY_POOLS)).not.toBeInTheDocument();
    });
  });

  describe('Staking', () => {
    it('should display table', async () => {
      await render(<App />, { path });

      const table = withinTable(TABLES.STAKED);

      expect(table.getAllByRole('row')).toHaveLength(1);
    });

    it('should not display table', async () => {
      mockGetStakedBalance.mockReturnValue(EMPTY_STAKED_BALANCE);

      await render(<App />, { path });

      expect(queryTable(TABLES.LIQUIDITY_POOLS)).not.toBeInTheDocument();
    });
  });
});
