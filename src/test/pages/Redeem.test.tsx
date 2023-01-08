import '@testing-library/jest-dom';

import { BitcoinAmount } from '@interlay/monetary-js';

import App from '@/App';
// ray test touch <<
import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { REDEEM_FEE_RATE } from '@/config/parachain';

// ray test touch >>
import { mockRedeemRequest } from '../mocks/@interlay/interbtc-api';
// ray test touch <<
import { MOCK_BITCOIN_PRICE_IN_USD } from '../mocks/fetch';
// ray test touch >>
import { act, render, screen, userEvent, waitFor } from '../test-utils';

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

    // Redeem IBTC
    await act(async () => {
      userEvent.click(submitButton);
    });

    // Check that the redeem method was called
    await waitFor(() => expect(mockRedeemRequest).toHaveBeenCalledTimes(1));
  });

  it('the redeem fee is correctly displayed', async () => {
    const textboxElements = screen.getAllByRole('textbox');

    const amountToRedeemInput = textboxElements[0];

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToRedeemInput, inputAmount.toString());
    });

    const redeemFee = new BitcoinAmount(inputAmount).mul(REDEEM_FEE_RATE);

    const redeemFeeElement = screen.getByRole(/redeem-bridge-fee/i);

    // ray test touch <<
    const redeemFeeInBTC = redeemFee.toHuman(8);
    // ray test touch >>

    // ray test touch <<
    expect(redeemFeeElement).toHaveTextContent(redeemFeeInBTC);

    const redeemFeeInUSD = displayMonetaryAmountInUSDFormat(redeemFee, MOCK_BITCOIN_PRICE_IN_USD);

    expect(redeemFeeElement).toHaveTextContent(redeemFeeInUSD.toString());
    // ray test touch >>
  });
});
