import '@testing-library/jest-dom';

import { ChainBalance, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinAmount, ExchangeRate } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';

import App from '@/App';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT, WRAPPED_TOKEN } from '@/config/relay-chains';

import {
  MOCK_EXCHANGE_RATE,
  MOCK_ISSUE_BRIDGE_FEE_RATE,
  MOCK_ISSUE_GRIEFING_COLLATERAL_RATE,
  MOCK_ISSUE_REQUEST_LIMITS,
  MOCK_TOKEN_BALANCE,
  mockIssueRequest
} from '../mocks/@interlay/interbtc-api';
import { DEFAULT_MOCK_PRICES, mockGovernanceTokenPriceInUsd } from '../mocks/fetch';
import { act, render, screen, userEvent, waitFor } from '../test-utils';

const getBridgeFee = (inputAmount: number) => {
  return new BitcoinAmount(inputAmount).mul(MOCK_ISSUE_BRIDGE_FEE_RATE);
};

const ISSUE_TAB_PATH = '/bridge?tab=issue';

describe('issue form', () => {
  it('issuing calls `issue.request` method', async () => {
    await render(<App />, { path: ISSUE_TAB_PATH });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    userEvent.click(issueTab);

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
    await render(<App />, { path: ISSUE_TAB_PATH });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    userEvent.click(issueTab);

    const amountToIssueInput = screen.getByRole('textbox');

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToIssueInput, inputAmount.toString());
    });

    const bridgeFee = getBridgeFee(inputAmount);

    const bridgeFeeElement = screen.getByTestId(/issue-bridge-fee/i);

    const bridgeFeeInBTC = bridgeFee.toHuman(8);

    expect(bridgeFeeElement).toHaveTextContent(bridgeFeeInBTC);

    const bridgeFeeInUSD = displayMonetaryAmountInUSDFormat(bridgeFee, DEFAULT_MOCK_PRICES.bitcoin.usd);

    expect(bridgeFeeElement).toHaveTextContent(bridgeFeeInUSD.toString());
  });

  it('the security deposit is correctly displayed', async () => {
    await render(<App />, { path: ISSUE_TAB_PATH });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    userEvent.click(issueTab);

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

    const securityDepositElement = screen.getByTestId(/security-deposit/i);

    const securityDepositInGovernanceToken = displayMonetaryAmount(securityDeposit);

    expect(securityDepositElement).toHaveTextContent(securityDepositInGovernanceToken);

    const securityDepositInUSD = displayMonetaryAmountInUSDFormat(securityDeposit, mockGovernanceTokenPriceInUsd);

    expect(securityDepositElement).toHaveTextContent(securityDepositInUSD);
  });

  it('the transaction fee is correctly displayed', async () => {
    await render(<App />, { path: ISSUE_TAB_PATH });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    userEvent.click(issueTab);

    const amountToIssueInput = screen.getByRole('textbox');

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToIssueInput, inputAmount.toString());
    });

    const transactionFeeElement = screen.getByTestId(/transaction-fee/i);

    const txFeeInGovernanceToken = displayMonetaryAmount(TRANSACTION_FEE_AMOUNT);

    expect(transactionFeeElement).toHaveTextContent(txFeeInGovernanceToken);

    const txFeeInUSD = displayMonetaryAmountInUSDFormat(TRANSACTION_FEE_AMOUNT, mockGovernanceTokenPriceInUsd);

    expect(transactionFeeElement).toHaveTextContent(txFeeInUSD);
  });

  it('the total receiving amount is correctly displayed', async () => {
    await render(<App />, { path: ISSUE_TAB_PATH });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    userEvent.click(issueTab);

    const amountToIssueInput = screen.getByRole('textbox');

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToIssueInput, inputAmount.toString());
    });

    const totalElement = screen.getByTestId(/total-receiving-amount/i);

    const bridgeFee = getBridgeFee(inputAmount);

    const monetaryBtcAmount = new BitcoinAmount(inputAmount);

    const total = monetaryBtcAmount.sub(bridgeFee);

    const totalInBTC = total.toHuman(8);

    expect(totalElement).toHaveTextContent(totalInBTC);

    const totalInUSD = displayMonetaryAmountInUSDFormat(total, DEFAULT_MOCK_PRICES.bitcoin.usd);

    expect(totalElement).toHaveTextContent(totalInUSD.toString());
  });

  it('the max issuable amounts are correctly displayed', async () => {
    await render(<App />, { path: ISSUE_TAB_PATH });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    userEvent.click(issueTab);

    const singleMaxIssuableAmountElement = screen.getByRole(/single-max-issuable/i);

    const singleMaxIssuableAmount = displayMonetaryAmount(MOCK_ISSUE_REQUEST_LIMITS.singleVaultMaxIssuable);

    expect(singleMaxIssuableAmountElement).toHaveTextContent(singleMaxIssuableAmount);

    const totalMaxIssuableAmountElement = screen.getByRole(/total-max-issuable/i);

    const totalMaxIssuableAmount = displayMonetaryAmount(MOCK_ISSUE_REQUEST_LIMITS.totalMaxIssuable);

    expect(totalMaxIssuableAmountElement).toHaveTextContent(totalMaxIssuableAmount);
  });

  it('when the governance token balance is less than required', async () => {
    (window.bridge.tokens.balance as any).mockImplementation((currency: CurrencyExt, _id: AccountId) => {
      if (currency.ticker === GOVERNANCE_TOKEN.ticker) {
        return new ChainBalance(currency, 0, 0);
      } else {
        return new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE);
      }
    });

    await render(<App />, { path: ISSUE_TAB_PATH });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    userEvent.click(issueTab);

    const amountToIssueInput = screen.getByRole('textbox');

    const inputAmount = 0.0001;

    await act(async () => {
      userEvent.type(amountToIssueInput, inputAmount.toString());
    });

    const errorElement = screen.getByText(/insufficient funds/i);

    expect(errorElement).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /confirm/i });

    await act(async () => {
      userEvent.click(submitButton);
    });

    await waitFor(() => expect(mockIssueRequest).toHaveBeenCalledTimes(0));

    (window.bridge.tokens.balance as any).mockImplementation(
      (currency: CurrencyExt, _id: AccountId) => new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE)
    );
  });

  it('when the input amount is greater than the single vault max issuable amount', async () => {
    await render(<App />, { path: ISSUE_TAB_PATH });

    const issueTab = screen.getByRole('tab', { name: /issue/i });
    userEvent.click(issueTab);

    const amountToIssueInput = screen.getByRole('textbox');

    const inputAmount = MOCK_ISSUE_REQUEST_LIMITS.singleVaultMaxIssuable.add(newMonetaryAmount('1', WRAPPED_TOKEN));

    await act(async () => {
      userEvent.type(amountToIssueInput, inputAmount.toString());
    });

    const errorElement = screen.getByText(/please enter less than/i);

    expect(errorElement).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /confirm/i });

    await act(async () => {
      userEvent.click(submitButton);
    });

    await waitFor(() => expect(mockIssueRequest).toHaveBeenCalledTimes(0));
  });
});
