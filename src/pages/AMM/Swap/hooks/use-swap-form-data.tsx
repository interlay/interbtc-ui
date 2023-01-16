import { newMonetaryAmount } from '@interlay/interbtc-api';
import Big from 'big.js';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { TokenInputProps } from '@/component-library';
import { SwapPair } from '@/types/swap';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

const useButtonProps = (
  pair: SwapPair,
  amount: { input?: number; output?: number }
): { children: ReactNode; disabled: boolean } => {
  const { getAvailableBalance } = useGetBalances();
  const { t } = useTranslation();

  if (!pair.input || !pair.output) {
    return {
      children: t('amm.select-token'),
      disabled: true
    };
  }

  if (!amount.input) {
    return { children: t('amm.enter-token-amount', { token: pair.input.ticker }), disabled: true };
  }

  if (new Big(amount.input).gt(getAvailableBalance(pair.input.ticker || '')?.toBig() || 0)) {
    return { children: t('amm.insufficient-token-balance', { token: pair.input.ticker }), disabled: true };
  }

  return {
    children: t('amm.swap'),
    disabled: false
  };
};

type UseSwapFormData = {
  inputProps: { balance: number; valueUSD: number; tokens: TokenInputProps['tokens'] };
  outputProps: { balance: number; valueUSD: number; tokens: TokenInputProps['tokens'] };
  buttonProps: { children: ReactNode; disabled: boolean };
};

const useSwapFormData = (pair: SwapPair, amount: { input?: number; output?: number }): UseSwapFormData => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();
  const buttonProps = useButtonProps(pair, amount);
  const { data: currencies } = useGetCurrencies(bridgeLoaded);

  const tokens: TokenInputProps['tokens'] = useMemo(
    () =>
      currencies?.map((currency) => ({
        balance: getAvailableBalance(currency.ticker)?.toBig().toNumber() || 0,
        balanceUSD: formatUSD(getTokenPrice(prices, currency.ticker)?.usd || 0),
        ticker: currency.ticker
      })),
    [currencies, getAvailableBalance, prices]
  );

  return {
    inputProps: {
      tokens,
      balance: pair.input ? getAvailableBalance(pair.input.ticker)?.toBig().toNumber() || 0 : 0,
      valueUSD:
        amount.input && pair.input
          ? convertMonetaryAmountToValueInUSD(
              newMonetaryAmount(amount.input, pair.input, true),
              getTokenPrice(prices, pair.input.ticker)?.usd
            ) || 0
          : 0
    },
    outputProps: {
      tokens,
      balance: pair.output ? getAvailableBalance(pair.output.ticker)?.toBig().toNumber() || 0 : 0,
      valueUSD:
        amount.output && pair.output
          ? convertMonetaryAmountToValueInUSD(
              newMonetaryAmount(amount.output, pair.output, true),
              getTokenPrice(prices, pair.output.ticker)?.usd
            ) || 0
          : 0
    },
    buttonProps
  };
};

export { useSwapFormData };
export type { UseSwapFormData };
