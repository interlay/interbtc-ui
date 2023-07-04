import MatchMediaMock from 'jest-matchmedia-mock';

import App from '@/App';
import { theme } from '@/component-library';
import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { NATIVE_CURRENCIES } from '@/utils/constants/currency';
import { PAGES, QUERY_PARAMETERS } from '@/utils/constants/links';

import {
  DEFAULT_TOKENS_BALANCE_FN,
  EMPTY_TOKENS_BALANCE_FN,
  MOCK_AMM,
  MOCK_SYSTEM,
  mockTokensBalance
} from '../mocks/@interlay/interbtc-api';
import {
  DEFAULT_STAKED_BALANCE,
  EMPTY_STAKED_BALANCE,
  mockGetStakedBalance
} from '../mocks/@interlay/interbtc-api/parachain/escrow';
import {
  DEFAULT_BORROW_POSITIONS,
  DEFAULT_LEND_POSITIONS,
  mockGetBorrowPositionsOfAccount,
  mockGetLendPositionsOfAccount
} from '../mocks/@interlay/interbtc-api/parachain/loans';
import {
  EMPTY_VESTING_SCHEDULES,
  mockClaimVesting,
  mockVestingSchedules,
  SOME_VESTING_SCHEDULES
} from '../mocks/@interlay/interbtc-api/parachain/vesting';
import { render, screen, userEvent, waitFor } from '../test-utils';
import { withinList } from './utils/list';
import { queryTable, withinTable, withinTableRow } from './utils/table';

jest.mock('@/pages/AMM', () => ({ __esModule: true, default: () => <div>Swap page</div> }));

const { getLpTokens, getLiquidityProvidedByAccount } = MOCK_AMM.MODULE;
const { getCurrentBlockNumber } = MOCK_SYSTEM.MODULE;

const { ACCOUNT_LIQUIDITY } = MOCK_AMM.DATA;
const { BLOCK_NUMBER } = MOCK_SYSTEM.DATA;

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
    mockTokensBalance.mockImplementation(DEFAULT_TOKENS_BALANCE_FN);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    getLiquidityProvidedByAccount.mockReturnValue(ACCOUNT_LIQUIDITY.EMPTY);
    mockGetStakedBalance.mockReturnValue(DEFAULT_STAKED_BALANCE);
    getCurrentBlockNumber.mockReturnValue(BLOCK_NUMBER.CURRENT);
    mockVestingSchedules.mockReturnValue(EMPTY_VESTING_SCHEDULES);
  });

  afterEach(() => {
    matchMedia.clear();
  });

  // TODO: add tests for Transfer CTALinks
  describe.skip('Available Assets', () => {
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

    it('should be able to claim vesting', async () => {
      getCurrentBlockNumber.mockReturnValue(10);
      mockVestingSchedules.mockReturnValue(SOME_VESTING_SCHEDULES);

      await render(<App />, { path });

      const row = withinTableRow(TABLES.AVAILABLE_ASSETS, GOVERNANCE_TOKEN.ticker);

      userEvent.click(row.getByRole('button', { name: /claim vesting/i }));

      await waitFor(() => {
        expect(mockClaimVesting).toHaveBeenCalledTimes(1);
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

    it('should display zero balance assets', async () => {
      mockTokensBalance.mockImplementation(EMPTY_TOKENS_BALANCE_FN);

      await render(<App />, { path });

      const table = withinTable(TABLES.AVAILABLE_ASSETS);

      expect(table.queryAllByRole('row')).toHaveLength(0);
      expect(screen.getByText(/no assets available/i)).toBeInTheDocument();

      userEvent.click(screen.getByRole('switch', { name: /show zero balance/i }));

      await waitFor(() => {
        expect(table.queryAllByRole('row')).toHaveLength(NATIVE_CURRENCIES.length);
      });
    });
  });

  describe('Lending Positions', () => {
    it('should display table', async () => {
      await render(<App />, { path });

      const table = withinTable(TABLES.LEND_POSITIONS);

      expect(table.getAllByRole('row')).toHaveLength(DEFAULT_LEND_POSITIONS.length);
    });

    it('should not display table', async () => {
      mockGetLendPositionsOfAccount.mockReturnValue([]);

      await render(<App />, { path });

      expect(queryTable(TABLES.LEND_POSITIONS)).not.toBeInTheDocument();
    });
  });

  describe('Borrow Positions', () => {
    it('should display table', async () => {
      await render(<App />, { path });

      const table = withinTable(TABLES.BORROW_POSITIONS);

      expect(table.getAllByRole('row')).toHaveLength(DEFAULT_BORROW_POSITIONS.length);
    });

    it('should not display table', async () => {
      mockGetBorrowPositionsOfAccount.mockReturnValue([]);

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
