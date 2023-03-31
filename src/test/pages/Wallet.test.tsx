import MatchMediaMock from 'jest-matchmedia-mock';

import App from '@/App';
import { theme } from '@/component-library';
import { RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { NATIVE_CURRENCIES } from '@/utils/constants/currency';
import { PAGES, QUERY_PARAMETERS } from '@/utils/constants/links';

import { mockGetLpTokens } from '../mocks/@interlay/interbtc-api/parachain/amm';
import { render, userEvent } from '../test-utils';
import { withinList } from './utils/list';
import { withinTable, withinTableRow } from './utils/table';

jest.mock('../../parts/Layout', () => {
  const MockedLayout: React.FC = ({ children }: any) => children;
  MockedLayout.displayName = 'MockedLayout';
  return MockedLayout;
});

jest.mock('@/pages/AMM', () => ({ __esModule: true, default: () => <div>Swap page</div> }));

const path = '/wallet';

const TABLES = {
  AVAILABLE_ASSETS: 'available assets'
};

describe('Wallet Page', () => {
  let matchMedia: MatchMediaMock;

  beforeEach(() => {
    matchMedia = new MatchMediaMock();

    // ignoring lp-tokens
    mockGetLpTokens.mockResolvedValue([]);
  });

  afterEach(() => {
    matchMedia.clear();
  });

  describe('Available Assets', () => {
    it('should render table', async () => {
      await render(<App />, { path });

      const table = withinTable(TABLES.AVAILABLE_ASSETS);

      expect(table.getAllByRole('row')).toHaveLength(NATIVE_CURRENCIES.length);
    });

    it('should render list', async () => {
      matchMedia.useMediaQuery(theme.breakpoints.down('md'));

      await render(<App />, { path });

      const list = withinList(TABLES.AVAILABLE_ASSETS);

      expect(list.getAllByRole('row')).toHaveLength(NATIVE_CURRENCIES.length);
    });

    it('should be able to navigate to redeem page', async () => {
      const { history } = await render(<App />, { path });

      const row = withinTableRow(TABLES.AVAILABLE_ASSETS, WRAPPED_TOKEN.ticker);

      userEvent.click(row.getByRole('link', { name: /redeem/i }));

      expect(history.location.pathname).toBe(PAGES.BRIDGE);
      expect(history.location.search).toMatch(`${QUERY_PARAMETERS.TAB}=redeem`);
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
  });

  // it('should render available assets table', async () => {
  //   mockGetLpTokens.mockResolvedValue([]);

  //   matchMedia.useMediaQuery(theme.breakpoints.up('md'));

  //   const { history } = await render(<App />, { path });

  //   const otherPoolsTable = withinTable(TABLES.AVAILABLE_ASSETS);

  //   expect(otherPoolsTable.getAllByRole('row')).toHaveLength(NATIVE_CURRENCIES.length);

  //   const row = withinTableRow(TABLES.AVAILABLE_ASSETS, WRAPPED_TOKEN.ticker);

  //   userEvent.click(row.getByRole('link', { name: /redeem/i }));

  //   expect(history.location.pathname).toBe(PAGES.BRIDGE);
  //   expect(history.location.search).toMatch(`${QUERY_PARAMETERS.TAB}=redeem`);

  //   userEvent.click(row.getByRole('link', { name: /swap/i }));

  //   expect(history.location.pathname).toBe(PAGES.SWAP);
  //   expect(history.location.search).toMatch(`${QUERY_PARAMETERS.SWAP.FROM}=${WRAPPED_TOKEN.ticker}`);
  // });
});
