import '@testing-library/jest-dom';

import { ChainBalance, CurrencyExt } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';

import App from '@/App';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { WRAPPED_TOKEN, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';

import {
  MOCK_REDEEM_BRIDGE_FEE_RATE,
  MOCK_REDEEM_CURRENT_INCLUSION_FEE,
  MOCK_TOKEN_BALANCE,
  mockRedeemRequest,
  mockVaultsWithRedeemableTokens
} from '../mocks/@interlay/interbtc-api';
import { DEFAULT_MOCK_PRICES } from '../mocks/fetch';
import { act, render, screen, userEvent, waitFor, within } from '../test-utils';

const getBridgeFee = (inputAmount: number) => {
  return new BitcoinAmount(inputAmount).mul(MOCK_REDEEM_BRIDGE_FEE_RATE);
};

const REDEEM_TAB_PATH = '/bridge?tab=redeem';

// TODO: type `props` properly
const renderRedeemForm = async (props?: any) => {
  await render(<App {...props} />, { path: REDEEM_TAB_PATH });

  const redeemTab = screen.getByRole('tab', { name: /redeem/i });

  const redeemTabPanel = screen.getByRole('tabpanel', {
    name: /redeem/i
  });

  userEvent.click(redeemTab);

  // ray test touch <
  const textboxElements = screen.getAllByRole('textbox');

  const amountToRedeemInput = textboxElements[0];

  const btcAddressToSendInput = textboxElements[1];
  // ray test touch >

  const submitButton = screen.getByRole('button', { name: /confirm/i });

  return {
    tab: redeemTab,
    tabPanel: redeemTabPanel,
    amountToRedeemInput,
    btcAddressToSendInput,
    submitButton,
    changeAmountToRedeem: async (value: string) => await act(async () => userEvent.type(amountToRedeemInput, value)),
    changeBtcAddressToSend: async (value: string) =>
      await act(async () => userEvent.type(btcAddressToSendInput, value)),
    submitForm: async () => await act(async () => userEvent.click(submitButton))
  };
};

describe('redeem form', () => {
  it('redeeming calls `redeem.request` method', async () => {
    const { changeAmountToRedeem, changeBtcAddressToSend, submitForm } = await renderRedeemForm();

    const inputAmount = 0.0001;

    await changeAmountToRedeem(inputAmount.toString());

    await changeBtcAddressToSend('tb1q3f6lu0g92q0d5jdng6m367uwpw7lnt7x3n0nqf');

    await submitForm();

    await waitFor(() => expect(mockRedeemRequest).toHaveBeenCalledTimes(1));
  });

  test('if the bridge fee is correctly displayed', async () => {
    const { changeAmountToRedeem } = await renderRedeemForm();

    const inputAmount = 0.0001;

    await changeAmountToRedeem(inputAmount.toString());

    const bridgeFee = getBridgeFee(inputAmount);

    const bridgeFeeElement = screen.getByTestId(/redeem-bridge-fee/i);

    const bridgeFeeInBTC = bridgeFee.toHuman(8);

    expect(bridgeFeeElement).toHaveTextContent(bridgeFeeInBTC);

    const bridgeFeeInUSD = displayMonetaryAmountInUSDFormat(bridgeFee, DEFAULT_MOCK_PRICES.bitcoin.usd);

    expect(bridgeFeeElement).toHaveTextContent(bridgeFeeInUSD.toString());
  });

  test('if the Bitcoin network fee is correctly displayed', async () => {
    const { changeAmountToRedeem } = await renderRedeemForm();

    const inputAmount = 0.0001;

    await changeAmountToRedeem(inputAmount.toString());

    const bitcoinNetworkFeeElement = screen.getByTestId(/redeem-bitcoin-network-fee/i);

    const bitcoinNetworkFeeInBTC = MOCK_REDEEM_CURRENT_INCLUSION_FEE.toHuman(8);

    expect(bitcoinNetworkFeeElement).toHaveTextContent(bitcoinNetworkFeeInBTC);

    const bitcoinNetworkFeeInUSD = displayMonetaryAmountInUSDFormat(
      MOCK_REDEEM_CURRENT_INCLUSION_FEE,
      DEFAULT_MOCK_PRICES.bitcoin.usd
    );

    expect(bitcoinNetworkFeeElement).toHaveTextContent(bitcoinNetworkFeeInUSD.toString());
  });

  test('if the total receiving amount is correctly displayed', async () => {
    const { changeAmountToRedeem } = await renderRedeemForm();

    const inputAmount = 0.0001;

    await changeAmountToRedeem(inputAmount.toString());

    const totalElement = screen.getByTestId(/total-receiving-amount/i);

    const bridgeFee = getBridgeFee(inputAmount);

    const monetaryWrappedTokenAmount = new BitcoinAmount(inputAmount);

    const total = monetaryWrappedTokenAmount.gt(bridgeFee.add(MOCK_REDEEM_CURRENT_INCLUSION_FEE))
      ? monetaryWrappedTokenAmount.sub(bridgeFee).sub(MOCK_REDEEM_CURRENT_INCLUSION_FEE)
      : BitcoinAmount.zero();

    const totalInBTC = total.toHuman(8);

    expect(totalElement).toHaveTextContent(totalInBTC);

    const totalInUSD = displayMonetaryAmountInUSDFormat(total, DEFAULT_MOCK_PRICES.bitcoin.usd);

    expect(totalElement).toHaveTextContent(totalInUSD.toString());
  });

  test('if the max redeemable amount is correctly displayed', async () => {
    await renderRedeemForm();

    const singleMaxIssuableAmountElement = screen.getByTestId(/single-max-redeemable/i);

    const singleMaxRedeemableAmount = displayMonetaryAmount(mockVaultsWithRedeemableTokens.values().next().value);

    expect(singleMaxIssuableAmountElement).toHaveTextContent(singleMaxRedeemableAmount);
  });

  it('when the wrapped token balance is less than required', async () => {
    (window.bridge.tokens.balance as any).mockImplementation((currency: CurrencyExt, _id: AccountId) => {
      if (currency.ticker === WRAPPED_TOKEN.ticker) {
        return new ChainBalance(currency, 0, 0);
      } else {
        return new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE);
      }
    });

    const { changeAmountToRedeem, submitForm, tabPanel } = await renderRedeemForm();

    const inputAmount = 0.0001;

    await changeAmountToRedeem(inputAmount.toString());

    // ray test touch <
    const errorElement = within(tabPanel).getByRole('alert', { name: WRAPPED_TOKEN_SYMBOL });
    // ray test touch >

    expect(errorElement.textContent).toMatchInlineSnapshot(
      `"Please enter an amount smaller than your current balance: 0"`
    );

    await submitForm();

    await waitFor(() => expect(mockRedeemRequest).not.toHaveBeenCalled());

    (window.bridge.tokens.balance as any).mockImplementation(
      (currency: CurrencyExt, _id: AccountId) => new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE)
    );
  });
});
