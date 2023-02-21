import { newMonetaryAmount } from '@interlay/interbtc-api';

import App from '@/App';

import {
  LP_TOKEN_1,
  LP_TOKEN_1_NAME,
  LP_TOKEN_2,
  LP_TOKEN_2_NAME,
  mockGetLiquidityProvidedByAccount
} from '../mocks/@interlay/interbtc-api/parachain/amm';
import { render, screen } from '../test-utils';
import { withinTable } from './utils/table';

const path = '/pools';

jest.mock('../../parts/Layout', () => {
  const MockedLayout: React.FC = ({ children }: any) => children;
  MockedLayout.displayName = 'MockedLayout';
  return MockedLayout;
});

describe('Pools Page', () => {
  it('should render pools', async () => {
    // should only display available pools
    let app = await render(<App />, { path });

    let otherPoolsTable = withinTable(/other pools/i);

    expect(otherPoolsTable.getAllByRole('row')).toHaveLength(2);
    expect(otherPoolsTable.getByRole('row', { name: LP_TOKEN_1_NAME })).toBeInTheDocument();
    expect(otherPoolsTable.getByRole('row', { name: LP_TOKEN_2_NAME })).toBeInTheDocument();

    expect(screen.queryByRole('grid', { name: /my pools/i })).not.toBeInTheDocument();

    mockGetLiquidityProvidedByAccount.mockResolvedValue([
      newMonetaryAmount(0, LP_TOKEN_1),
      newMonetaryAmount(10, LP_TOKEN_2)
    ]);

    app.unmount();

    // should display both available and account pools
    app = await render(<App />, { path });

    otherPoolsTable = withinTable(/other pools/i);

    expect(otherPoolsTable.getAllByRole('row')).toHaveLength(1);
    expect(otherPoolsTable.getByRole('row', { name: LP_TOKEN_1_NAME })).toBeInTheDocument();

    let myPoolsTable = withinTable(/my pools/i);

    expect(myPoolsTable.getAllByRole('row')).toHaveLength(1);
    expect(myPoolsTable.getByRole('row', { name: LP_TOKEN_2_NAME })).toBeInTheDocument();

    app.unmount();

    mockGetLiquidityProvidedByAccount.mockResolvedValue([
      newMonetaryAmount(10, LP_TOKEN_1),
      newMonetaryAmount(10, LP_TOKEN_2)
    ]);

    // should only display account pools
    app = await render(<App />, { path });

    expect(screen.queryByRole('grid', { name: /other pools/i })).not.toBeInTheDocument();

    myPoolsTable = withinTable(/my pools/i);

    expect(myPoolsTable.getAllByRole('row')).toHaveLength(2);
  });

  // it('should render pools', async () => {

  // })
});
