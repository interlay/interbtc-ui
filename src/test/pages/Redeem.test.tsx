import '@testing-library/jest-dom';

import { ChainBalance, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinAmount, ExchangeRate } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';

import App from '@/App';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { BLOCKS_BEHIND_LIMIT } from '@/config/parachain';
import { WRAPPED_TOKEN, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { BTC_ADDRESS_LABEL } from '@/pages/Bridge/RedeemForm';

import {
  MOCK_BITCOIN_HEIGHT,
  MOCK_BTC_RELAY_HEIGHT,
  MOCK_EXCHANGE_RATE,
  MOCK_TOKEN_BALANCE,
  mockBtcRelayGetLatestBlockHeight,
  mockElectrsAPIGetLatestBlockHeight,
  mockOracleGetExchangeRate,
  mockRedeemGetCurrentInclusionFee,
  mockRedeemGetDustValue,
  mockRedeemGetFeeRate,
  mockRedeemRequest,
  mockTokensBalance,
  mockVaultsGetVaultsWithRedeemableTokens
} from '../mocks/@interlay/interbtc-api';
import { MOCK_TOKEN_PRICES } from '../mocks/fetch';
import { act, render, screen, userEvent, waitFor, within } from '../test-utils';

const getBridgeFee = (inputAmount: number) => {
  return new BitcoinAmount(inputAmount).mul(mockRedeemGetFeeRate());
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

  const amountToRedeemInput = screen.getByRole('textbox', { name: WRAPPED_TOKEN_SYMBOL });

  const btcAddressToSendInput = screen.getByRole('textbox', { name: BTC_ADDRESS_LABEL });

  const submitButton = screen.getByRole('button', { name: /confirm/i });

  const errorElement = within(redeemTabPanel).getByRole('alert', { name: WRAPPED_TOKEN_SYMBOL });

  return {
    tab: redeemTab,
    errorElement,
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

    const bridgeFeeInUSD = displayMonetaryAmountInUSDFormat(bridgeFee, MOCK_TOKEN_PRICES.bitcoin.usd);

    expect(bridgeFeeElement).toHaveTextContent(bridgeFeeInUSD.toString());
  });

  test('if the Bitcoin network fee is correctly displayed', async () => {
    const { changeAmountToRedeem } = await renderRedeemForm();

    const inputAmount = 0.0001;

    await changeAmountToRedeem(inputAmount.toString());

    const bitcoinNetworkFeeElement = screen.getByTestId(/redeem-bitcoin-network-fee/i);

    const bitcoinNetworkFeeInBTC = mockRedeemGetCurrentInclusionFee().toHuman(8);

    expect(bitcoinNetworkFeeElement).toHaveTextContent(bitcoinNetworkFeeInBTC);

    const bitcoinNetworkFeeInUSD = displayMonetaryAmountInUSDFormat(
      mockRedeemGetCurrentInclusionFee(),
      MOCK_TOKEN_PRICES.bitcoin.usd
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

    const total = monetaryWrappedTokenAmount.gt(bridgeFee.add(mockRedeemGetCurrentInclusionFee()))
      ? monetaryWrappedTokenAmount.sub(bridgeFee).sub(mockRedeemGetCurrentInclusionFee())
      : BitcoinAmount.zero();

    const totalInBTC = total.toHuman(8);

    expect(totalElement).toHaveTextContent(totalInBTC);

    const totalInUSD = displayMonetaryAmountInUSDFormat(total, MOCK_TOKEN_PRICES.bitcoin.usd);

    expect(totalElement).toHaveTextContent(totalInUSD.toString());
  });

  test('if the max redeemable amount is correctly displayed', async () => {
    await renderRedeemForm();

    const singleMaxIssuableAmountElement = screen.getByTestId(/single-max-redeemable/i);

    const singleMaxRedeemableAmount = displayMonetaryAmount(
      mockVaultsGetVaultsWithRedeemableTokens().values().next().value
    );

    expect(singleMaxIssuableAmountElement).toHaveTextContent(singleMaxRedeemableAmount);
  });

  it('when the wrapped token balance is less than required', async () => {
    mockTokensBalance.mockImplementation((currency: CurrencyExt, _id: AccountId) => {
      if (currency.ticker === WRAPPED_TOKEN.ticker) {
        return new ChainBalance(currency, 0, 0);
      } else {
        return new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE);
      }
    });

    const { changeAmountToRedeem, submitForm, errorElement } = await renderRedeemForm();

    const inputAmount = 0.0001;

    await changeAmountToRedeem(inputAmount.toString());

    expect(errorElement.textContent).toMatchInlineSnapshot(
      `"Please enter an amount smaller than your current balance: 0"`
    );

    await submitForm();

    await waitFor(() => expect(mockRedeemRequest).not.toHaveBeenCalled());

    mockTokensBalance.mockImplementation(
      (currency: CurrencyExt, _id: AccountId) => new ChainBalance(currency, MOCK_TOKEN_BALANCE, MOCK_TOKEN_BALANCE)
    );
  });

  it('when the input amount is greater than the single vault max redeemable amount', async () => {
    const { changeAmountToRedeem, submitForm, errorElement } = await renderRedeemForm();

    const inputAmount = mockVaultsGetVaultsWithRedeemableTokens()
      .values()
      .next()
      .value.add(newMonetaryAmount('1', Bitcoin));

    await changeAmountToRedeem(inputAmount.toString());

    expect(errorElement.textContent).toMatchInlineSnapshot(
      `" The Vault with the highest amount of locked BTC has 100 BTC which is the maximum you can redeem in a single request. You can request to redeem from multiple Vaults to get your whole amount of BTC."`
    );

    await submitForm();

    await waitFor(() => expect(mockRedeemRequest).not.toHaveBeenCalled());
  });

  it('when the input amount is less than the combined', async () => {
    const { changeAmountToRedeem, submitForm, errorElement } = await renderRedeemForm();

    const inputAmount = mockRedeemGetDustValue()
      .add(mockRedeemGetCurrentInclusionFee())
      .sub(newMonetaryAmount(1, Bitcoin));

    await changeAmountToRedeem(inputAmount.toString());

    expect(errorElement.textContent).toMatchInlineSnapshot(
      `"Please enter an amount above the combined Bridge Fee, Bitcoin Network Fee, and Bitcoin Dust limit (0 BTC)."`
    );

    await submitForm();

    await waitFor(() => expect(mockRedeemRequest).not.toHaveBeenCalled());
  });

  it('when the parachain is more than 6 blocks behind', async () => {
    mockBtcRelayGetLatestBlockHeight.mockImplementation(() => MOCK_BTC_RELAY_HEIGHT);
    mockElectrsAPIGetLatestBlockHeight.mockImplementation(() => BLOCKS_BEHIND_LIMIT + MOCK_BTC_RELAY_HEIGHT + 1);

    const { changeAmountToRedeem, submitForm, errorElement } = await renderRedeemForm();

    const inputAmount = 0.0001;

    await changeAmountToRedeem(inputAmount.toString());

    expect(errorElement.textContent).toMatchInlineSnapshot(
      `"You can't redeem IBTC at the moment because IBTC bridge is more than 6 blocks behind."`
    );

    await submitForm();

    await waitFor(() => expect(mockRedeemRequest).not.toHaveBeenCalled());

    mockBtcRelayGetLatestBlockHeight.mockImplementation(() => MOCK_BTC_RELAY_HEIGHT);
    mockElectrsAPIGetLatestBlockHeight.mockImplementation(() => MOCK_BITCOIN_HEIGHT);
  });

  it('when the oracle is offline', async () => {
    mockOracleGetExchangeRate.mockImplementation(
      (currency: CurrencyExt) => new ExchangeRate(Bitcoin, currency, new Big(0))
    );

    const { changeAmountToRedeem, submitForm, errorElement } = await renderRedeemForm();

    const inputAmount = 0.0001;

    await changeAmountToRedeem(inputAmount.toString());

    expect(errorElement.textContent).toMatchInlineSnapshot(
      `"You can't redeem IBTC at the moment because oracle is offline."`
    );

    await submitForm();

    await waitFor(() => expect(mockRedeemRequest).not.toHaveBeenCalled());

    mockOracleGetExchangeRate.mockImplementation(
      (currency: CurrencyExt) => new ExchangeRate(Bitcoin, currency, MOCK_EXCHANGE_RATE)
    );
  });
});
