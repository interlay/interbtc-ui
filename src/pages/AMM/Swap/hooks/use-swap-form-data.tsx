import { Trade } from '@interlay/interbtc-api';
import Big from 'big.js';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD, formatUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { TokenInputProps } from '@/component-library';
import { SwapPair } from '@/types/swap';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

const useButtonProps = (
  pair: SwapPair,
  inputAmount?: number,
  trade?: Trade | null
): { children: ReactNode; disabled: boolean } => {
  const { getAvailableBalance } = useGetBalances();
  const { t } = useTranslation();

  if (!pair.input || !pair.output) {
    return {
      children: t('amm.select_token'),
      disabled: true
    };
  }

  if (!inputAmount) {
    return { children: t('amm.enter_token_amount', { token: pair.input.ticker }), disabled: true };
  }

  if (new Big(inputAmount).gt(getAvailableBalance(pair.input.ticker || '')?.toBig() || 0)) {
    return { children: t('amm.insufficient_token_balance', { token: pair.input.ticker }), disabled: true };
  }

  // At this stage, all input related fields have been filled
  if (trade === undefined) {
    return { children: 'Loading...', disabled: true };
  }

  if (trade === null) {
    return { children: t('amm.insufficient_liquidity_trade'), disabled: true };
  }

  return {
    children: t('amm.swap'),
    disabled: false
  };
};

type UseSwapFormData = {
  inputProps: { balance: number; valueUSD: number; tokens: TokenInputProps['tokens'] };
  outputProps: { balance: number; valueUSD: number; tokens: TokenInputProps['tokens']; value?: number };
  buttonProps: { children: ReactNode; disabled: boolean };
};

const useSwapFormData = (pair: SwapPair, inputAmount?: number, trade?: Trade | null): UseSwapFormData => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();
  const buttonProps = useButtonProps(pair, inputAmount, trade);
  const { data: currencies } = useGetCurrencies(bridgeLoaded);

  const tokens: TokenInputProps['tokens'] = useMemo(
    () =>
      currencies?.map((currency) => {
        const balance = getAvailableBalance(currency.ticker);
        const balanceUSD = balance
          ? convertMonetaryAmountToValueInUSD(balance, getTokenPrice(prices, currency.ticker)?.usd)
          : 0;
        return {
          balance: Number(balance?.toBig().toFixed(balance.currency.humanDecimals)) || 0,
          balanceUSD: formatUSD(balanceUSD || 0, { compact: true }),
          ticker: currency.ticker
        };
      }),
    [currencies, getAvailableBalance, prices]
  );

  return {
    inputProps: {
      tokens,
      balance: pair.input ? getAvailableBalance(pair.input.ticker)?.toBig().toNumber() || 0 : 0,
      valueUSD:
        inputAmount && pair.input
          ? convertMonetaryAmountToValueInUSD(
              newSafeMonetaryAmount(inputAmount, pair.input, true),
              getTokenPrice(prices, pair.input.ticker)?.usd
            ) || 0
          : 0
    },
    outputProps: {
      tokens,
      balance: pair.output ? getAvailableBalance(pair.output.ticker)?.toBig().toNumber() || 0 : 0,
      value: trade?.outputAmount.toBig().toNumber(),
      valueUSD:
        trade?.outputAmount && pair.output
          ? convertMonetaryAmountToValueInUSD(trade.outputAmount, getTokenPrice(prices, pair.output.ticker)?.usd) || 0
          : 0
    },
    buttonProps
  };
};

export { useSwapFormData };
export type { UseSwapFormData };
