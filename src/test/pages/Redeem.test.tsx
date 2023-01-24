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

describe('redeem form', () => {
  beforeEach(async () => {
    await render(<App />, { path: '/bridge?tab=redeem' });

    const redeemTab = screen.getByRole('tab', { name: /redeem/i });
    userEvent.click(redeemTab);
  });

  it('redeeming calls `redeem.request` method', async () => {
    const textboxElements = screen.getAllByRole('textbox');

    const amountToRedeemInput = textboxElements[0];

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToRedeemInput, inputAmount.toString());
    });

    const btcAddressToSendInput = textboxElements[1];

    await act(async () => {
      userEvent.type(btcAddressToSendInput, 'tb1q3f6lu0g92q0d5jdng6m367uwpw7lnt7x3n0nqf');
    });

    const submitButton = screen.getByRole('button', { name: /confirm/i });

    await act(async () => {
      userEvent.click(submitButton);
    });

    await waitFor(() => expect(mockRedeemRequest).toHaveBeenCalledTimes(1));
  });

  it('the bridge fee is correctly displayed', async () => {
    const textboxElements = screen.getAllByRole('textbox');

    const amountToRedeemInput = textboxElements[0];

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToRedeemInput, inputAmount.toString());
    });

    const bridgeFee = getBridgeFee(inputAmount);

    const bridgeFeeElement = screen.getByTestId(/redeem-bridge-fee/i);

    const bridgeFeeInBTC = bridgeFee.toHuman(8);

    expect(bridgeFeeElement).toHaveTextContent(bridgeFeeInBTC);

    const bridgeFeeInUSD = displayMonetaryAmountInUSDFormat(bridgeFee, DEFAULT_MOCK_PRICES.bitcoin.usd);

    expect(bridgeFeeElement).toHaveTextContent(bridgeFeeInUSD.toString());
  });

  it('the Bitcoin network fee is correctly displayed', async () => {
    const textboxElements = screen.getAllByRole('textbox');

    const amountToRedeemInput = textboxElements[0];

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToRedeemInput, inputAmount.toString());
    });

    const bitcoinNetworkFeeElement = screen.getByTestId(/redeem-bitcoin-network-fee/i);

    const bitcoinNetworkFeeInBTC = MOCK_REDEEM_CURRENT_INCLUSION_FEE.toHuman(8);

    expect(bitcoinNetworkFeeElement).toHaveTextContent(bitcoinNetworkFeeInBTC);

    const bitcoinNetworkFeeInUSD = displayMonetaryAmountInUSDFormat(
      MOCK_REDEEM_CURRENT_INCLUSION_FEE,
      DEFAULT_MOCK_PRICES.bitcoin.usd
    );

    expect(bitcoinNetworkFeeElement).toHaveTextContent(bitcoinNetworkFeeInUSD.toString());
  });

  it('the total receiving amount is correctly displayed', async () => {
    const textboxElements = screen.getAllByRole('textbox');

    const amountToRedeemInput = textboxElements[0];

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToRedeemInput, inputAmount.toString());
    });

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

  it('the max redeemable amount is correctly displayed', async () => {
    const singleMaxIssuableAmountElement = screen.getByTestId(/single-max-redeemable/i);

    const singleMaxRedeemableAmount = displayMonetaryAmount(mockVaultsWithRedeemableTokens.values().next().value);

    expect(singleMaxIssuableAmountElement).toHaveTextContent(singleMaxRedeemableAmount);
  });
});
