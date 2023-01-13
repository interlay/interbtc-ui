import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import Big from 'big.js';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebounce } from 'react-use';

import { StoreType } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { Card, CardProps, Divider, Flex, H1, TokenInput, TokenInputProps } from '@/component-library';
import { AuthCTA } from '@/components/AuthCTA';
import { SwapPair, SwapSlippage } from '@/types/swap';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { useSwapFormData } from '../../hooks/use-swap-form-data';
import { SlippageManager } from '../SlippageManager';
import { SwapInfo } from '../SwapInfo';
import { SwapDivider } from './SwapDivider';

const getOutput = async (param?: number) => {
  return param;
};

const getPairChange = (pair: SwapPair, currency: CurrencyExt, name: string): SwapPair => {
  switch (name) {
    case FormFields.INPUT_TICKER: {
      if (currency.ticker === pair.output?.ticker) {
        return { input: currency, output: pair.input };
      }

      return { ...pair, input: currency };
    }
    case FormFields.OUTPUT_TICKER: {
      if (currency.ticker === pair.input?.ticker) {
        return { input: pair.output, output: currency };
      }

      return { ...pair, output: currency };
    }
    default:
      return pair;
  }
};

const useFormState = (pair: SwapPair, input?: number, output?: number, availableInput?: Big) => {
  let children;
  let disabled = true;

  if (!pair.input || !pair.output) {
    children = 'Select Token';
  } else if (!input) {
    children = `Enter ${pair.input.ticker} amount`;
  } else if (new Big(input).gt(availableInput || 0)) {
    children = `Insufficient ${pair.input.ticker} balance`;
  } else {
    children = 'Swap';
    disabled = false;
  }

  return {
    btn: {
      children,
      disabled
    }
  };
};

enum FormFields {
  INPUT_AMOUNT = 'input-amount',
  INPUT_TICKER = 'input-ticker',
  OUTPUT_AMOUNT = 'output-amount',
  OUTPUT_TICKER = 'output-ticker'
}

type SwapFormData = {
  [FormFields.INPUT_AMOUNT]: { value: string };
  [FormFields.INPUT_TICKER]: { value: string };
  [FormFields.OUTPUT_AMOUNT]: { value: string };
  [FormFields.OUTPUT_TICKER]: { value: string };
};

type Props = {
  pair: SwapPair;
  onChangePair: (pair: SwapPair) => void;
};

type InheritAttrs = CardProps & Props;

type SwapFormProps = Props & InheritAttrs;

const SwapForm = ({ pair, onChangePair, ...props }: SwapFormProps): JSX.Element | null => {
  // const { t } = useTranslation();

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { data: currencies, getCurrencyFromTicker } = useGetCurrencies(bridgeLoaded);
  const prices = useGetPrices();
  const { getAvailableBalance } = useGetBalances();

  const [slippage, setSlippage] = useState<SwapSlippage>('0.1%');

  const [inputAmount, setInputAmount] = useState<number>();
  const [outputAmount, setOutputAmount] = useState<number>();

  useDebounce(
    async () => {
      const output = await getOutput(inputAmount);
      setOutputAmount(output);
    },
    500,
    [inputAmount, pair]
  );

  const { btn } = useFormState(pair, inputAmount, outputAmount, getAvailableBalance(pair.input?.ticker || '')?.toBig());

  const tokens: TokenInputProps['tokens'] = currencies?.map((currency) => ({
    balance: getAvailableBalance(currency.ticker)?.toBig().toNumber() || 0,
    balanceUSD: formatUSD(getTokenPrice(prices, currency.ticker)?.usd || 0),
    ticker: currency.ticker
  }));

  const { input: inputSchema, output: outputSchema } = useSwapFormData(pair);

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = Number(e.target.value) || undefined;
    setInputAmount(value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formElements = form.elements as typeof form.elements & SwapFormData;

    const {
      [FormFields.INPUT_AMOUNT]: inputAmount,
      [FormFields.OUTPUT_AMOUNT]: outputAmount,
      [FormFields.INPUT_TICKER]: inputTicker,
      [FormFields.OUTPUT_TICKER]: outputTicker
    } = formElements;

    console.log('input: ', inputAmount.value);
    console.log('output: ', outputAmount.value);
    console.log('tickers: ', inputTicker.value, '/', outputTicker.value);
    // try {
    //   const inputAmount = data['input-amount'] || 0;
    //   const outputAmount = data['output-amount'] || 0;
    //   console.log(pair.input, inputAmount);
    //   console.log(pair.output, outputAmount);
    // } catch (err: any) {
    //   toast.error(err.toString());
    // }
  };

  const handleTickerChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value: ticker, name } = e.target;

    const currency = getCurrencyFromTicker(ticker);
    const newPair = getPairChange(pair, currency, name);

    onChangePair(newPair);
  };

  const hasCompletePair = !!(pair.input && pair.output);

  const inputValueUSD = pair.input
    ? convertMonetaryAmountToValueInUSD(
        newMonetaryAmount(inputAmount || 0, pair.input, true),
        getTokenPrice(prices, pair.input.ticker)?.usd
      ) || 0
    : 0;
  const outputValueUSD = pair.output
    ? convertMonetaryAmountToValueInUSD(
        newMonetaryAmount(outputAmount || 0, pair.output, true),
        getTokenPrice(prices, pair.output.ticker)?.usd
      ) || 0
    : 0;

  return (
    <Card {...props} gap='spacing2'>
      <H1 size='base' color='secondary' weight='bold' align='center'>
        Swap
      </H1>
      <Divider orientation='horizontal' color='secondary' />
      <Flex direction='column'>
        <SlippageManager value={slippage} onChange={(slippage) => setSlippage(slippage)} />
        <form onSubmit={handleSubmit}>
          <Flex direction='column' gap='spacing4'>
            <Flex direction='column' gap='spacing12'>
              <TokenInput
                placeholder='0.00'
                label='From'
                valueUSD={inputValueUSD}
                balance={inputSchema?.balance || 0}
                tokens={tokens}
                ticker={pair.input?.ticker || ''}
                selectProps={{
                  name: FormFields.INPUT_TICKER,
                  onChange: handleTickerChange,
                  value: (pair.input?.ticker || '') as never
                }}
                name={FormFields.INPUT_AMOUNT}
                onChange={handleChangeInput}
              />
              <SwapDivider />
              <TokenInput
                placeholder='0.00'
                label='To'
                valueUSD={outputValueUSD}
                balance={outputSchema?.balance || 0}
                tokens={tokens}
                isReadOnly
                value={outputAmount}
                name={FormFields.OUTPUT_AMOUNT}
                selectProps={{
                  name: FormFields.OUTPUT_TICKER,
                  onChange: handleTickerChange,
                  value: pair.output?.ticker || ''
                }}
              />
            </Flex>
            {hasCompletePair && <SwapInfo pair={pair} />}
            <AuthCTA type='submit' disabled={btn.disabled} fullWidth size='large'>
              {btn.children}
            </AuthCTA>
          </Flex>
        </form>
      </Flex>
    </Card>
  );
};

export { SwapForm };
export type { SwapFormProps };
