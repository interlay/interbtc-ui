import '@testing-library/jest-dom';

import { ChainBalance, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinAmount, ExchangeRate } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';

import App from '@/App';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { BLOCKS_BEHIND_LIMIT } from '@/config/parachain';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT, WRAPPED_TOKEN } from '@/config/relay-chains';

import {
  MOCK_BITCOIN_HEIGHT,
  MOCK_BTC_RELAY_HEIGHT,
  MOCK_EXCHANGE_RATE,
  MOCK_TOKEN_BALANCE,
  mockBtcRelayGetLatestBlockHeight,
  mockElectrsAPIGetLatestBlockHeight,
  mockFeeGetIssueFee,
  mockFeeGetIssueGriefingCollateralRate,
  mockIssueGetDustValue,
  mockIssueGetRequestLimits,
  mockIssueRequest,
  mockOracleGetExchangeRate,
  mockTokensBalance
} from '../mocks/@interlay/interbtc-api';
import { MOCK_TOKEN_PRICES, mockGovernanceTokenPriceInUsd } from '../mocks/fetch';
import { act, render, screen, userEvent, waitFor, within } from '../test-utils';

const getBridgeFee = (inputAmount: number) => {
  return new BitcoinAmount(inputAmount).mul(mockFeeGetIssueFee());
};

const ISSUE_TAB_PATH = '/bridge?tab=issue';

// TODO: type `props` properly
const renderIssueForm = async (props?: any) => {
  await render(<App {...props} />, { path: ISSUE_TAB_PATH });

  const issueTab = screen.getByRole('tab', { name: /issue/i });

  const issueTabPanel = screen.getByRole('tabpanel', {
    name: /issue/i
  });

  userEvent.click(issueTab);

  const amountToIssueInput = screen.getByRole('textbox');

  const submitButton = screen.getByRole('button', { name: /confirm/i });

  const errorElement = within(issueTabPanel).getByRole('alert');

  return {
    tab: issueTab,
    errorElement,
    amountToIssueInput,
    submitButton,
    changeAmountToIssue: async (value: string) => await act(async () => userEvent.type(amountToIssueInput, value)),
    submitForm: async () => await act(async () => userEvent.click(submitButton))
  };
};

describe('issue form', () => {
  it('if the issue method is called', async () => {
    const { changeAmountToIssue, submitForm } = await renderIssueForm();

    const inputAmount = 0.0001;

    await changeAmountToIssue(inputAmount.toString());

    await submitForm();

    await waitFor(() => expect(mockIssueRequest).toHaveBeenCalledTimes(1));
  });

  it('if the bridge fee is correctly displayed', async () => {
    const { changeAmountToIssue } = await renderIssueForm();

    const inputAmount = 0.0001;

    await changeAmountToIssue(inputAmount.toString());

    const bridgeFee = getBridgeFee(inputAmount);

    const bridgeFeeElement = screen.getByTestId(/issue-bridge-fee/i);

    const bridgeFeeInBTC = bridgeFee.toHuman(8);

    expect(bridgeFeeElement).toHaveTextContent(bridgeFeeInBTC);

    const bridgeFeeInUSD = displayMonetaryAmountInUSDFormat(bridgeFee, MOCK_TOKEN_PRICES.bitcoin.usd);

    expect(bridgeFeeElement).toHaveTextContent(bridgeFeeInUSD.toString());
  });

  it('if the security deposit is correctly displayed', async () => {
    const { changeAmountToIssue } = await renderIssueForm();

    const inputAmount = 0.0001;

    await changeAmountToIssue(inputAmount.toString());

    const btcToGovernanceTokenRate = mockOracleGetExchangeRate(GOVERNANCE_TOKEN);

    const monetaryBtcAmount = new BitcoinAmount(inputAmount);

    const securityDeposit = btcToGovernanceTokenRate
      .toCounter(monetaryBtcAmount)
      .mul(mockFeeGetIssueGriefingCollateralRate());

    const securityDepositElement = screen.getByTestId(/security-deposit/i);

    const securityDepositInGovernanceToken = displayMonetaryAmount(securityDeposit);

    expect(securityDepositElement).toHaveTextContent(securityDepositInGovernanceToken);

    const securityDepositInUSD = displayMonetaryAmountInUSDFormat(securityDeposit, mockGovernanceTokenPriceInUsd);

    expect(securityDepositElement).toHaveTextContent(securityDepositInUSD);
  });

  it('if the transaction fee is correctly displayed', async () => {
    const { changeAmountToIssue } = await renderIssueForm();

    const inputAmount = 0.0001;

    await changeAmountToIssue(inputAmount.toString());

    const transactionFeeElement = screen.getByTestId(/transaction-fee/i);

    const txFeeInGovernanceToken = displayMonetaryAmount(TRANSACTION_FEE_AMOUNT);

    expect(transactionFeeElement).toHaveTextContent(txFeeInGovernanceToken);

    const txFeeInUSD = displayMonetaryAmountInUSDFormat(TRANSACTION_FEE_AMOUNT, mockGovernanceTokenPriceInUsd);

    expect(transactionFeeElement).toHaveTextContent(txFeeInUSD);
  });

  it('if the total receiving amount is correctly displayed', async () => {
    const { changeAmountToIssue } = await renderIssueForm();

    const inputAmount = 0.0001;

    await changeAmountToIssue(inputAmount.toString());

    const totalElement = screen.getByTestId(/total-receiving-amount/i);

    const bridgeFee = getBridgeFee(inputAmount);

    const monetaryBtcAmount = new BitcoinAmount(inputAmount);

    const total = monetaryBtcAmount.sub(bridgeFee);

    const totalInBTC = total.toHuman(8);

    expect(totalElement).toHaveTextContent(totalInBTC);

    const totalInUSD = displayMonetaryAmountInUSDFormat(total, MOCK_TOKEN_PRICES.bitcoin.usd);

    expect(totalElement).toHaveTextContent(totalInUSD.toString());
  });

  it('if the max issuable amounts are correctly displayed', async () => {
    await renderIssueForm();

    const singleMaxIssuableAmountElement = screen.getByTestId(/single-max-issuable/i);

    const singleMaxIssuableAmount = displayMonetaryAmount(mockIssueGetRequestLimits().singleVaultMaxIssuable);

    expect(singleMaxIssuableAmountElement).toHaveTextContent(singleMaxIssuableAmount);

    const totalMaxIssuableAmountElement = screen.getByTestId(/total-max-issuable/i);

    const totalMaxIssuableAmount = displayMonetaryAmount(mockIssueGetRequestLimits().totalMaxIssuable);

    expect(totalMaxIssuableAmountElement).toHaveTextContent(totalMaxIssuableAmount);
  });

  it('when the governance token balance is less than required', async () => {
    mockTokensBalance.mockImplementation((currency: CurrencyExt, _id: AccountId) => {
      if (currency.ticker === GOVERNANCE_TOKEN.ticker) {
        return new ChainBalance(currency, 0, 0);
      } else {
        return new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE);
      }
    });

    const { changeAmountToIssue, submitForm, errorElement } = await renderIssueForm();

    const inputAmount = 0.0001;

    await changeAmountToIssue(inputAmount.toString());

    expect(errorElement.textContent).toMatchInlineSnapshot(`"Insufficient free INTR for security deposit and fees"`);

    await submitForm();

    await waitFor(() => expect(mockIssueRequest).not.toHaveBeenCalled());

    mockTokensBalance.mockImplementation(
      (currency: CurrencyExt, _id: AccountId) => new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE)
    );
  });

  it('when the input amount is greater than the single vault max issuable amount', async () => {
    const { changeAmountToIssue, submitForm, errorElement } = await renderIssueForm();

    const inputAmount = mockIssueGetRequestLimits().singleVaultMaxIssuable.add(newMonetaryAmount('1', WRAPPED_TOKEN));

    await changeAmountToIssue(inputAmount.toString());

    expect(errorElement.textContent).toMatchInlineSnapshot(`"Please enter less than 0.565 IBTC."`);

    await submitForm();

    await waitFor(() => expect(mockIssueRequest).not.toHaveBeenCalled());
  });

  it('when the input amount is less than the Bitcoin dust amount', async () => {
    const { changeAmountToIssue, submitForm, errorElement } = await renderIssueForm();

    const inputAmount = mockIssueGetDustValue().sub(newMonetaryAmount(1, Bitcoin));

    await changeAmountToIssue(inputAmount.toString());

    expect(errorElement.textContent).toMatchInlineSnapshot(
      `"Please enter an amount greater than Bitcoin dust limit (0 BTC)."`
    );

    await submitForm();

    await waitFor(() => expect(mockIssueRequest).not.toHaveBeenCalled());
  });

  it('when the parachain is more than 6 blocks behind', async () => {
    mockBtcRelayGetLatestBlockHeight.mockImplementation(() => MOCK_BTC_RELAY_HEIGHT);
    mockElectrsAPIGetLatestBlockHeight.mockImplementation(() => BLOCKS_BEHIND_LIMIT + MOCK_BTC_RELAY_HEIGHT + 1);

    const { changeAmountToIssue, submitForm, errorElement } = await renderIssueForm();

    const inputAmount = 0.0001;

    await changeAmountToIssue(inputAmount.toString());

    expect(errorElement.textContent).toMatchInlineSnapshot(
      `"You can't issue IBTC at the moment because IBTC parachain is more than 6 blocks behind."`
    );

    await submitForm();

    await waitFor(() => expect(mockIssueRequest).not.toHaveBeenCalled());

    mockBtcRelayGetLatestBlockHeight.mockImplementation(() => MOCK_BTC_RELAY_HEIGHT);
    mockElectrsAPIGetLatestBlockHeight.mockImplementation(() => MOCK_BITCOIN_HEIGHT);
  });

  it('when the oracle is offline', async () => {
    mockOracleGetExchangeRate.mockImplementation(
      (currency: CurrencyExt) => new ExchangeRate(Bitcoin, currency, new Big(0))
    );

    const { changeAmountToIssue, submitForm, errorElement } = await renderIssueForm();

    const inputAmount = 0.0001;

    await changeAmountToIssue(inputAmount.toString());

    expect(errorElement.textContent).toMatchInlineSnapshot(
      `"You can't issue IBTC at the moment because oracle is offline."`
    );

    await submitForm();

    await waitFor(() => expect(mockIssueRequest).not.toHaveBeenCalled());

    mockOracleGetExchangeRate.mockImplementation(
      (currency: CurrencyExt) => new ExchangeRate(Bitcoin, currency, MOCK_EXCHANGE_RATE)
    );
  });
});
