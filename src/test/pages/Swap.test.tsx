import App from '@/App';
import { RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

import { DEFAULT_DEADLINE_BLOCK_NUMBER, mockGetFutureBlockNumber } from '../mocks/@interlay/interbtc-api';
import {
  DEFAULT_ACCOUNT_LIQUIDITY,
  DEFAULT_TRADE,
  DEFAULT_TRADE_AMOUNT,
  mockGetLiquidityProvidedByAccount,
  mockSwap
} from '../mocks/@interlay/interbtc-api/parachain/amm';
import { DEFAULT_ACCOUNT_ADDRESS } from '../mocks/substrate/mocks';
import { render, screen, userEvent, waitFor, within } from '../test-utils';

const path = '/swap';

describe('Swap Page', () => {
  beforeEach(() => {
    mockGetLiquidityProvidedByAccount.mockResolvedValue(DEFAULT_ACCOUNT_LIQUIDITY);
  });

  it('should be able to swap', async () => {
    await render(<App />, { path });

    // Submit button should be disabled
    expect(screen.getByRole('button', { name: /select token/i })).toBeDisabled();

    // Output field should be disabled and his token field empty
    expect(
      screen.getByRole('textbox', {
        name: 'To',
        exact: true
      })
    ).toBeDisabled();
    expect(screen.getByRole('textbox', { name: /to field token/i })).toHaveValue('');

    /* START - Select Output token */

    userEvent.click(screen.getByRole('button', { name: /to field token/i }));

    let dialog = within(screen.getByRole('dialog', { name: /select token/i }));

    userEvent.click(dialog.getByRole('row', { name: RELAY_CHAIN_NATIVE_TOKEN.ticker }));

    await waitFor(() => {
      // Fields should switch tokens
      expect(screen.getByRole('textbox', { name: /from field token/i })).toHaveValue('');
      expect(screen.getByRole('textbox', { name: /to field token/i })).toHaveValue(RELAY_CHAIN_NATIVE_TOKEN.ticker);
      // Submit button should be disabled
      expect(screen.getByRole('button', { name: /select token/i })).toBeDisabled();
    });

    /* END - Select Output token */

    /* START - Select Input token */

    userEvent.click(screen.getByRole('button', { name: /from field token/i }));

    dialog = within(screen.getByRole('dialog', { name: /select token/i }));

    userEvent.click(dialog.getByRole('row', { name: WRAPPED_TOKEN.ticker }));

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /from field token/i })).toHaveValue(WRAPPED_TOKEN.ticker);
    });

    /* END - Select Input token */

    /* START - Switch tokens */

    userEvent.click(screen.getByRole('button', { name: /switch tokens/i }));

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /from field token/i })).toHaveValue(RELAY_CHAIN_NATIVE_TOKEN.ticker);
      expect(screen.getByRole('textbox', { name: /to field token/i })).toHaveValue(WRAPPED_TOKEN.ticker);

      // Submit button should be disabled
      expect(
        screen.getByRole('button', { name: new RegExp(`enter ${RELAY_CHAIN_NATIVE_TOKEN.ticker} amount`, 'i') })
      ).toBeDisabled();
    });

    /* END - Switch tokens */

    /* START - Create a trade setup */

    userEvent.type(screen.getByRole('textbox', { name: 'From' }), DEFAULT_TRADE_AMOUNT.INPUT.toString());

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /loading.../i })).toBeDisabled();
    });

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', {
          name: 'To'
        })
      ).toHaveValue(DEFAULT_TRADE_AMOUNT.OUTPUT.toString());
    });

    /* END - Create a trade setup */

    /* START - Trade setup info */
    const swapInfoTitle = new RegExp(
      `1 ${DEFAULT_TRADE_AMOUNT.INPUT.currency.ticker} = ${DEFAULT_TRADE.executionPrice.toHuman()}`
    );

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
    expect(swapInfoRegion.getByText(/fees/i)).toBeInTheDocument();

    /* END - Trade setup info */

    /* START - Trade setup liquidity */

    expect(
      screen.getByRole('heading', {
        name: new RegExp(
          `${DEFAULT_TRADE_AMOUNT.INPUT.currency.ticker} - ${DEFAULT_TRADE_AMOUNT.OUTPUT.currency.ticker}`,
          'i'
        )
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/volume/i, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/liquidity/i)).toBeInTheDocument();

    /* END - Trade setup liquidity */

    /* START - Execute trade setup */

    userEvent.click(screen.getByRole('button', { name: /swap/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /loading.../i, exact: false })).toBeDisabled();
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: new RegExp(`enter ${RELAY_CHAIN_NATIVE_TOKEN.ticker} amount`, 'i') })
      ).toBeInTheDocument();

      expect(screen.getByRole('textbox', { name: 'From' })).toHaveValue('');
      expect(screen.getByRole('textbox', { name: 'To' })).toHaveValue('');
    });

    expect(DEFAULT_TRADE.getMinimumOutputAmount).toHaveBeenCalledWith(0.1);
    expect(mockGetFutureBlockNumber).toHaveBeenCalledTimes(1);
    expect(mockSwap).toHaveBeenCalledWith(
      DEFAULT_TRADE,
      DEFAULT_TRADE_AMOUNT.OUTPUT,
      DEFAULT_ACCOUNT_ADDRESS,
      DEFAULT_DEADLINE_BLOCK_NUMBER
    );

    /* END - Execute trade setup */

    /* START - Execute trade setup with different slippage */

    userEvent.click(screen.getByRole('button', { name: /slippage settings/i }));

    const slippageDialog = within(screen.getByRole('dialog', { name: /set slippage tolerance/i }));

    userEvent.click(slippageDialog.getByRole('gridcell', { name: /0.5%/ }));

    userEvent.type(screen.getByRole('textbox', { name: 'From' }), DEFAULT_TRADE_AMOUNT.INPUT.toString());

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', {
          name: 'To'
        })
      ).toHaveValue(DEFAULT_TRADE_AMOUNT.OUTPUT.toString());
    });

    userEvent.click(screen.getByRole('button', { name: /swap/i }));

    await waitFor(() => {
      expect(DEFAULT_TRADE.getMinimumOutputAmount).toHaveBeenCalledWith(0.5);
    });

    /* END - Execute trade setup with different slippage */
  });
});
