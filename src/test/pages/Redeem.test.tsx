import '@testing-library/jest-dom';

import Big from 'big.js';

import App from '@/App';
import { REDEEM_FEE_RATE } from '@/config/parachain';

import { mockRedeemRequest } from '../mocks/@interlay/interbtc-api';
import { act, render, screen, userEvent, waitFor } from '../test-utils';

describe('redeem form', () => {
  // ray test touch <<
  beforeEach(async () => {
    await render(<App />, { path: '/bridge?tab=redeem' });

    const redeemTab = screen.getByRole('tab', { name: /redeem/i });
    userEvent.click(redeemTab);
  });
  // ray test touch >>

  it('redeeming calls `redeem.request` method', async () => {
    const textboxElements = screen.getAllByRole('textbox');

    const amountToRedeemInput = textboxElements[0];

    // ray test touch <<
    const inputAmount = 0.0001;
    // ray test touch >>

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

    // ray test touch <<
    const redeemFee = Big(inputAmount).mul(REDEEM_FEE_RATE);

    const redeemFeeElement = screen.getByRole(/redeem-bridge-fee/i);

    expect(redeemFeeElement).toHaveTextContent(redeemFee.toString());
    // ray test touch >>
  });
});
