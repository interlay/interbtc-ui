import App from '@/App';
import { RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

import { MOCK_AMM, MOCK_SYSTEM } from '../mocks/@interlay/interbtc-api/parachain';
import { DEFAULT_ACCOUNT_1 } from '../mocks/substrate/mocks';
import { render, screen, userEvent, waitFor, within } from '../test-utils';
import { getFeeTokenSelect, waitForFeeEstimate, waitForTransactionExecute } from './utils/transaction';

const { ACCOUNT_LIQUIDITY, TRADE } = MOCK_AMM.DATA;
const { getLiquidityProvidedByAccount, swap } = MOCK_AMM.MODULE;

const { BLOCK_NUMBER } = MOCK_SYSTEM.DATA;
const { getFutureBlockNumber } = MOCK_SYSTEM.MODULE;

jest.useFakeTimers();

const path = '/swap';

jest.mock('../../parts/Layout', () => {
  const MockedLayout: React.FC = ({ children }: any) => children;
  MockedLayout.displayName = 'MockedLayout';
  return MockedLayout;
});

describe('Swap Page', () => {
  beforeEach(() => {
    getLiquidityProvidedByAccount.mockResolvedValue(ACCOUNT_LIQUIDITY.EMPTY);
  });

  // There is only a single test case that tests the whole flow of a swap
  it('should be able to swap', async () => {
    await render(<App />, { path });

    // Submit button should be disabled
    expect(screen.getAllByRole('button', { name: /select token/i })[1]).toBeDisabled();

    // Output field should be disabled and his token field empty
    expect(
      screen.getByRole('textbox', {
        name: 'To',
        exact: true
      })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: /choose token for to field/i })).toHaveTextContent(/select token/i);

    /* START - Select Output token */

    userEvent.click(screen.getByRole('button', { name: /choose token for to field/i }));

    let dialog = within(screen.getByRole('dialog', { name: /select token/i }));

    userEvent.click(dialog.getByRole('row', { name: RELAY_CHAIN_NATIVE_TOKEN.ticker }));

    await waitFor(() => {
      // Fields should switch tokens
      expect(screen.getByRole('button', { name: /choose token for from field/i })).toHaveTextContent(/select token/i);
      expect(screen.getByRole('button', { name: /choose token for to field/i })).toHaveTextContent(
        RELAY_CHAIN_NATIVE_TOKEN.ticker
      );
      // Submit button should be disabled
      expect(screen.getAllByRole('button', { name: /select token/i })[1]).toBeDisabled();
    });

    /* END - Select Output token */

    /* START - Select Input token */

    userEvent.click(screen.getByRole('button', { name: /choose token for from field/i }));

    dialog = within(screen.getByRole('dialog', { name: /select token/i }));

    userEvent.click(dialog.getByRole('row', { name: WRAPPED_TOKEN.ticker }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /choose token for from field/i })).toHaveTextContent(
        WRAPPED_TOKEN.ticker
      );
    });

    /* END - Select Input token */

    /* START - Switch tokens */

    userEvent.click(screen.getByRole('button', { name: /switch tokens/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /choose token for from field/i })).toHaveTextContent(
        RELAY_CHAIN_NATIVE_TOKEN.ticker
      );
      expect(screen.getByRole('button', { name: /choose token for to field/i })).toHaveTextContent(
        WRAPPED_TOKEN.ticker
      );

      // Submit button should be disabled
      expect(
        screen.getByRole('button', { name: new RegExp(`enter ${RELAY_CHAIN_NATIVE_TOKEN.ticker} amount`, 'i') })
      ).toBeDisabled();
    });

    /* END - Switch tokens */

    /* START - Create a trade setup */

    userEvent.type(screen.getByRole('textbox', { name: 'From' }), TRADE.inputAmount.toString());

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', {
          name: 'To'
        })
      ).toHaveValue(TRADE.outputAmount.toString());
    });

    await waitForFeeEstimate(swap);

    expect(getFutureBlockNumber).toHaveBeenCalledTimes(1);

    /* END - Create a trade setup */

    /* START - Trade setup info */
    const swapInfoTitle = new RegExp(`1 ${TRADE.inputAmount.currency.ticker} = ${TRADE.executionPrice.toHuman()}`);

    expect(screen.queryByRole('region', { name: swapInfoTitle })).not.toBeVisible();

    userEvent.click(
      screen.getByRole('button', {
        name: swapInfoTitle
      })
    );

    await waitFor(() => {
      expect(screen.getByRole('region', { name: swapInfoTitle })).toBeVisible();
    });

    const swapInfoRegion = within(screen.getByRole('region', { name: swapInfoTitle }));

    expect(swapInfoRegion.getByText(/expected output/i)).toBeInTheDocument();
    expect(swapInfoRegion.getByText(/minimum received/i)).toBeInTheDocument();
    expect(swapInfoRegion.getByText(/price impact/i)).toBeInTheDocument();

    /* END - Trade setup info */

    /* START - Trade setup liquidity */

    expect(
      screen.getByRole('heading', {
        name: new RegExp(`${TRADE.inputAmount.currency.ticker} - ${TRADE.outputAmount.currency.ticker}`, 'i')
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/volume/i, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/liquidity/i)).toBeInTheDocument();

    /* END - Trade setup liquidity */

    // should have select fee component
    expect(getFeeTokenSelect()).toBeInTheDocument();

    /* START - Execute trade setup */

    userEvent.click(screen.getByRole('button', { name: /swap/i }));

    await waitForTransactionExecute(swap);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: new RegExp(`enter ${RELAY_CHAIN_NATIVE_TOKEN.ticker} amount`, 'i') })
      ).toBeInTheDocument();

      expect(screen.getByRole('textbox', { name: 'From' })).toHaveValue('');
      expect(screen.getByRole('textbox', { name: 'To' })).toHaveValue('');
    });

    expect(TRADE.getMinimumOutputAmount).toHaveBeenCalledWith(0.1);
    expect(getFutureBlockNumber).toHaveBeenCalledTimes(2);
    expect(swap).toHaveBeenCalledWith(TRADE, TRADE.outputAmount, DEFAULT_ACCOUNT_1.address, BLOCK_NUMBER.FUTURE);

    /* END - Execute trade setup */
  });

  it('should be able to swap with different slippage', async () => {
    await render(<App />, { path });

    userEvent.click(screen.getByRole('button', { name: /choose token for to field/i }));

    const dialog = within(screen.getByRole('dialog', { name: /select token/i }));

    userEvent.click(dialog.getByRole('row', { name: WRAPPED_TOKEN.ticker }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: new RegExp(`enter ${RELAY_CHAIN_NATIVE_TOKEN.ticker} amount`, 'i') })
      ).toBeDisabled();
    });

    userEvent.click(screen.getByRole('button', { name: /slippage settings/i }));

    const slippageDialog = within(screen.getByRole('dialog', { name: /set slippage tolerance/i }));

    userEvent.click(slippageDialog.getByRole('gridcell', { name: /0.5%/ }));

    userEvent.type(screen.getByRole('textbox', { name: 'From' }), TRADE.inputAmount.toString());

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', {
          name: 'To'
        })
      ).toHaveValue(TRADE.outputAmount.toString());
    });

    await waitForFeeEstimate(swap);

    userEvent.click(screen.getByRole('button', { name: /swap/i }));

    await waitForTransactionExecute(swap);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'From' })).toHaveValue('');
      expect(screen.getByRole('textbox', { name: 'To' })).toHaveValue('');
    });

    await waitFor(() => {
      expect(TRADE.getMinimumOutputAmount).toHaveBeenCalledWith(0.5);
    });
  });

  it('should show price impact warning', async () => {
    await render(<App />, { path });

    /* START - Create a trade setup */

    userEvent.click(screen.getByRole('button', { name: /choose token for to field/i }));

    const dialog = within(screen.getByRole('dialog', { name: /select token/i }));

    userEvent.click(dialog.getByRole('row', { name: WRAPPED_TOKEN.ticker }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /choose token for to field/i })).toHaveTextContent(
        WRAPPED_TOKEN.ticker
      );
    });

    userEvent.click(screen.getByRole('button', { name: /switch tokens/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /choose token for from field/i })).toHaveTextContent(
        WRAPPED_TOKEN.ticker
      );
    });

    userEvent.type(screen.getByRole('textbox', { name: 'From' }), '100');

    await waitForFeeEstimate(swap);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /swap/i })).toBeInTheDocument();
    });
    /* END - Create a trade setup */

    userEvent.click(screen.getByRole('button', { name: /swap/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /price impact warning/i })).toBeInTheDocument();
    });

    const withinPriceImpactDialog = within(screen.getByRole('dialog', { name: /price impact warning/i }));

    userEvent.click(withinPriceImpactDialog.getByRole('button', { name: /confirm swap/i }));

    await waitForTransactionExecute(swap);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'From' })).toHaveValue('');
      expect(screen.getByRole('textbox', { name: 'To' })).toHaveValue('');
    });
  });

  it('should setup input and output currencies from search query', async () => {
    await render(<App />, { path: `${path}?from=${WRAPPED_TOKEN.ticker}&to=${RELAY_CHAIN_NATIVE_TOKEN.ticker}` });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /choose token for from field/i })).toHaveTextContent(
        WRAPPED_TOKEN.ticker
      );

      expect(screen.getByRole('button', { name: /choose token for to field/i })).toHaveTextContent(
        RELAY_CHAIN_NATIVE_TOKEN.ticker
      );
    });
  });

  it('should setup input and output currencies to default pair when query is invalid', async () => {
    await render(<App />, { path: `${path}?from=&to=` });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /choose token for from field/i })).toHaveTextContent(
        RELAY_CHAIN_NATIVE_TOKEN.ticker
      );

      expect(screen.getByRole('button', { name: /choose token for to field/i })).toHaveTextContent(/select token/i);
    });
  });
});
