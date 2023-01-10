import '@testing-library/jest-dom';

import { Bitcoin, BitcoinAmount, ExchangeRate } from '@interlay/monetary-js';

import App from '@/App';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';

import {
  MOCK_EXCHANGE_RATE,
  MOCK_ISSUE_BRIDGE_FEE_RATE,
  MOCK_ISSUE_GRIEFING_COLLATERAL_RATE,
  mockIssueRequest
} from '../mocks/@interlay/interbtc-api';
import { DEFAULT_MOCK_PRICES, mockGovernanceTokenPriceInUsd } from '../mocks/fetch';
import { act, render, screen, userEvent, waitFor } from '../test-utils';

const getBridgeFee = (inputAmount: number) => {
  return new BitcoinAmount(inputAmount).mul(MOCK_ISSUE_BRIDGE_FEE_RATE);
};

describe('issue form', () => {
  beforeEach(async () => {
    await render(<App />, { path: '/bridge?tab=issue' });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    userEvent.click(issueTab);
  });

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

    const bridgeFeeInUSD = displayMonetaryAmountInUSDFormat(bridgeFee, DEFAULT_MOCK_PRICES.bitcoin.usd);

    expect(bridgeFeeElement).toHaveTextContent(bridgeFeeInUSD.toString());
  });

  it('the security deposit is correctly displayed', async () => {
    const amountToIssueInput = screen.getByRole('textbox');

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToIssueInput, inputAmount.toString());
    });

    const btcToGovernanceTokenRate = new ExchangeRate(Bitcoin, GOVERNANCE_TOKEN, MOCK_EXCHANGE_RATE);

    const monetaryBtcAmount = new BitcoinAmount(inputAmount);

    const securityDeposit = btcToGovernanceTokenRate
      .toCounter(monetaryBtcAmount)
      .mul(MOCK_ISSUE_GRIEFING_COLLATERAL_RATE);

    const securityDepositElement = screen.getByRole(/security-deposit/i);

    const securityDepositInGovernanceToken = displayMonetaryAmount(securityDeposit);

    expect(securityDepositElement).toHaveTextContent(securityDepositInGovernanceToken);

    const securityDepositInUSD = displayMonetaryAmountInUSDFormat(securityDeposit, mockGovernanceTokenPriceInUsd);

    expect(securityDepositElement).toHaveTextContent(securityDepositInUSD);
  });

  it('the transaction fee is correctly displayed', async () => {
    const amountToIssueInput = screen.getByRole('textbox');

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToIssueInput, inputAmount.toString());
    });

    const transactionFeeElement = screen.getByRole(/transaction-fee/i);

    const txFeeInGovernanceToken = displayMonetaryAmount(TRANSACTION_FEE_AMOUNT);

    expect(transactionFeeElement).toHaveTextContent(txFeeInGovernanceToken);

    const txFeeInUSD = displayMonetaryAmountInUSDFormat(TRANSACTION_FEE_AMOUNT, mockGovernanceTokenPriceInUsd);

    expect(transactionFeeElement).toHaveTextContent(txFeeInUSD);
  });

  // ray test touch <
  it('the total receiving amount is correctly displayed', async () => {
    const amountToIssueInput = screen.getByRole('textbox');

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToIssueInput, inputAmount.toString());
    });
  });
  // ray test touch >
});
