import App from '@/App';
import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

import {
  DEFAULT_ACCOUNT_LIQUIDITY,
  mockGetLiquidityProvidedByAccount
} from '../mocks/@interlay/interbtc-api/parachain/amm';
import { render, screen, userEvent, waitFor, waitForElementToBeRemoved, within } from '../test-utils';

const path = '/swap';

jest.mock('../../parts/Layout', () => {
  const MockedLayout: React.FC = ({ children }: any) => children;
  MockedLayout.displayName = 'MockedLayout';
  return MockedLayout;
});

describe('Pools Page', () => {
  beforeEach(() => {
    mockGetLiquidityProvidedByAccount.mockResolvedValue(DEFAULT_ACCOUNT_LIQUIDITY);
  });

  it('should render swap', async () => {
    await render(<App />, { path });

    // userEvent.click(screen.getByRole('button', { name: RELAY_CHAIN_NATIVE_TOKEN.ticker }));

    // should have Output Select Token and form submit button

    const [outputSelectToken, submitBtn] = screen.getAllByRole('button', { name: /select token/i });

    expect(submitBtn).toBeDisabled();

    userEvent.click(outputSelectToken);

    const dialog = within(screen.getByRole('dialog', { name: /select token/i }));

    userEvent.click(dialog.getByRole('row', { name: WRAPPED_TOKEN.ticker }));

    await waitFor(() => {
      screen.getByRole('button', { name: WRAPPED_TOKEN.ticker });
    });

    expect(
      screen.getByRole('button', { name: new RegExp(`enter ${RELAY_CHAIN_NATIVE_TOKEN.ticker} amount`, 'i') })
    ).toBeDisabled();

    userEvent.type(screen.getByRole('textbox', { name: /from/i }));
  });
});
