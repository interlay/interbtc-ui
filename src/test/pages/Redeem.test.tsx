import '@testing-library/jest-dom';

import { BitcoinAmount } from '@interlay/monetary-js';

import App from '@/App';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';

import {
  MOCK_REDEEM_BRIDGE_FEE_RATE,
  MOCK_REDEEM_CURRENT_INCLUSION_FEE,
  mockRedeemRequest,
  mockVaultsWithRedeemableTokens
} from '../mocks/@interlay/interbtc-api';
import { DEFAULT_MOCK_PRICES } from '../mocks/fetch';
import { act, render, screen, userEvent, waitFor } from '../test-utils';

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

  const textboxElements = screen.getAllByRole('textbox');

  const amountToRedeemInput = textboxElements[0];

  const btcAddressToSendInput = textboxElements[1];

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
});
