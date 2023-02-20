import { newMonetaryAmount } from '@interlay/interbtc-api';

import App from '@/App';

import {
  LP_TOKEN_1,
  LP_TOKEN_1_NAME,
  LP_TOKEN_2,
  mockGetLiquidityProvidedByAccount
} from '../mocks/@interlay/interbtc-api/parachain/amm';
import { render, screen } from '../test-utils';
import { getTable, withinTable } from './utils/table';

const path = '/pools';

jest.mock('../../parts/Layout', () => {
  const MockedLayout: React.FC = ({ children }: any) => children;
  MockedLayout.displayName = 'MockedLayout';
  return MockedLayout;
});

describe('Pools Page', () => {
  it('should render pools', async () => {
    let app = await render(<App />, { path });

    let otherPoolsTable = withinTable(/other pools/i);

    expect(otherPoolsTable.getAllByRole('row')).toHaveLength(2);

    expect(screen.queryByRole('grid', { name: /my pools/i })).not.toBeInTheDocument();
    // expect(table.getByRole('row', { name: LP_TOKEN_1_NAME })).toBeInTheDocument();

    mockGetLiquidityProvidedByAccount.mockResolvedValue([
      newMonetaryAmount(0, LP_TOKEN_1),
      newMonetaryAmount(10, LP_TOKEN_2)
    ]);

    app.unmount();

    app = await render(<App />, { path });

    otherPoolsTable = withinTable(/other pools/i);

    expect(otherPoolsTable.getAllByRole('row')).toHaveLength(1);

    let myPoolsTable = withinTable(/my pools/i);

    expect(myPoolsTable.getAllByRole('row')).toHaveLength(1);

    app.unmount();

    mockGetLiquidityProvidedByAccount.mockResolvedValue([
      newMonetaryAmount(10, LP_TOKEN_1),
      newMonetaryAmount(10, LP_TOKEN_2)
    ]);

    app = await render(<App />, { path });

    otherPoolsTable = withinTable(/other pools/i);

    expect(otherPoolsTable.getAllByRole('row')).toHaveLength(0);

    myPoolsTable = withinTable(/my pools/i);

    expect(myPoolsTable.getAllByRole('row')).toHaveLength(2);
  });
});
