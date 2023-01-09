import '@testing-library/jest-dom';

// ray test touch <
import { BitcoinAmount } from '@interlay/monetary-js';

// ray test touch >
import App from '@/App';
import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { ISSUE_BRIDGE_FEE_RATE } from '@/config/parachain';

import { mockIssueRequest } from '../mocks/@interlay/interbtc-api';
import { MOCK_BITCOIN_PRICE_IN_USD } from '../mocks/fetch';
import { act, render, screen, userEvent, waitFor } from '../test-utils';

// ray test touch <
const getBridgeFee = (inputAmount: number) => {
  return new BitcoinAmount(inputAmount).mul(ISSUE_BRIDGE_FEE_RATE);
};
// ray test touch >

describe('issue form', () => {
  // ray test touch <
  beforeEach(async () => {
    await render(<App />, { path: '/bridge?tab=issue' });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    userEvent.click(issueTab);
  });
  // ray test touch >

  it('issuing calls `issue.request` method', async () => {
    const amountToIssueInput = screen.getByRole('textbox');

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToIssueInput, inputAmount.toString());
    });

    const submitButton = screen.getByRole('button', { name: /confirm/i });

    await act(async () => {
      userEvent.click(submitButton);
    });

    await waitFor(() => expect(mockIssueRequest).toHaveBeenCalledTimes(1));
  });

  // ray test touch <
  it('the bridge fee is correctly displayed', async () => {
    const amountToIssueInput = screen.getByRole('textbox');

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToIssueInput, inputAmount.toString());
    });

    const bridgeFee = getBridgeFee(inputAmount);

    const bridgeFeeElement = screen.getByRole(/issue-bridge-fee/i);

    const bridgeFeeInBTC = bridgeFee.toHuman(8);

    expect(bridgeFeeElement).toHaveTextContent(bridgeFeeInBTC);

    const bridgeFeeInUSD = displayMonetaryAmountInUSDFormat(bridgeFee, MOCK_BITCOIN_PRICE_IN_USD);

    expect(bridgeFeeElement).toHaveTextContent(bridgeFeeInUSD.toString());
  });
  // ray test touch >
});
