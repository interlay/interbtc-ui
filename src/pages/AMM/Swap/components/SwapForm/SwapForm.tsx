import { newMonetaryAmount } from '@interlay/interbtc-api';
import _ from 'lodash';
import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

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

const getOutput = async (param: number) => {
  return param;
};

// const getPairChange = (pair: SwapPair, currency: CurrencyExt, name: string): SwapPair => {
//   switch (name) {
//     case FormFields.INPUT_TICKER: {
//       if (currency.ticker === pair.output?.ticker) {
//         return { input: currency, output: pair.input };
//       }

//       return { ...pair, input: currency };
//     }
//     case FormFields.OUTPUT_TICKER: {
//       if (currency.ticker === pair.input?.ticker) {
//         return { input: pair.output, output: currency };
//       }

//       return { ...pair, output: currency };
//     }
//     default:
//       return pair;
//   }
// };

// enum FormFields {
//   INPUT_AMOUNT = 'input-amount',
//   INPUT_TICKER = 'input-ticker',
//   OUTPUT_AMOUNT = 'output-amount',
//   OUTPUT_TICKER = 'output-ticker'
// }

type Props = {
  pair: SwapPair;
  onChangePair: (pair: SwapPair) => void;
};

type InheritAttrs = CardProps & Props;

type SwapFormProps = Props & InheritAttrs;

const SwapForm = ({ pair, ...props }: SwapFormProps): JSX.Element | null => {
  // const { t } = useTranslation();

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const {
    data: currencies
    // getCurrencyFromTicker
  } = useGetCurrencies(bridgeLoaded);
  const prices = useGetPrices();
  const { getAvailableBalance } = useGetBalances();

  const [slippage, setSlippage] = useState<SwapSlippage>('0.1%');

  const [inputAmount, setInputAmount] = useState<number>(0);
  const [outputAmount, setOutputAmount] = useState<number>(0);

  const tokens: TokenInputProps['tokens'] = currencies?.map((currency) => ({
    balance: getAvailableBalance(currency.ticker)?.toBig().toNumber() || 0,
    balanceUSD: formatUSD(getTokenPrice(prices, currency.ticker)?.usd || 0),
    ticker: currency.ticker
  }));

  const { input: inputSchema, output: outputSchema } = useSwapFormData(pair);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(async (e) => {
    const value = Number(e.target.value || 0);

    const output = await getOutput(value);

    setOutputAmount(output);
  }, []);

  const handleDebouncedChange = useMemo(() => _.debounce(handleChange, 500), [handleChange]);

  useEffect(() => {
    return () => {
      handleDebouncedChange.cancel();
    };
  }, [handleDebouncedChange]);

  const handleSubmit = () => {
    // try {
    //   const inputAmount = data['input-amount'] || 0;
    //   const outputAmount = data['output-amount'] || 0;
    //   console.log(pair.input, inputAmount);
    //   console.log(pair.output, outputAmount);
    // } catch (err: any) {
    //   toast.error(err.toString());
    // }
  };

  // const handleTickerChange: ChangeEventHandler<HTMLInputElement> = (e) => {
  //   const { value: ticker, name } = e.target;

  //   const currency = getCurrencyFromTicker(ticker);
  //   const newPair = getPairChange(pair, currency, name);

  //   onChangePair(newPair);
  // };

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
                // selectProps={{
                //   name: FormFields.INPUT_TICKER,
                //   onChange: handleTickerChange,
                //   value: (pair.input?.ticker || '') as never
                // }}
                value={inputAmount}
                onChange={(e) => {
                  // if (!pair.input || !pair.output) return;
                  const value = e.target.value ? Number(e.target.value) : 0;
                  setInputAmount(value);
                  // handleDebouncedChange(e);
                }}
              />
              <SwapDivider />
              <TokenInput
                placeholder='0.00'
                label='To'
                valueUSD={outputValueUSD}
                balance={outputSchema?.balance || 0}
                // tokens={tokens}
                isReadOnly
                value={inputAmount}
                yo
                // selectProps={{
                //   name: FormFields.OUTPUT_TICKER,
                //   onChange: handleTickerChange,
                //   value: pair.output?.ticker || ''
                // }}
              />
            </Flex>
            {hasCompletePair && <SwapInfo pair={pair} />}
            <AuthCTA type='submit' disabled fullWidth>
              Swap
            </AuthCTA>
          </Flex>
        </form>
      </Flex>
    </Card>
  );
};

export { SwapForm };
export type { SwapFormProps };
