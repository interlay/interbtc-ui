import App from '@/App';

import { render, screen, within } from '../test-utils';

jest.mock('../../parts/Layout', () => {
  const MockedLayout: React.FC = ({ children }: any) => children;
  MockedLayout.displayName = 'MockedLayout';
  return MockedLayout;
});

describe('Pools Page', () => {
  it('should render pools', async () => {
    await render(<App />, { path: '/pools' });

    const table = within(screen.getByRole('grid', { name: /other pools/i }));

    expect(table.getAllByRole('row')).toHaveLength(2);

    // const row = table.getByRole('row', { name: new RegExp(`${asset} ${asset}`, 'i') });
  });
});
