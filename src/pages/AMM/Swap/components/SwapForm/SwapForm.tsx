import { zodResolver } from '@hookform/resolvers/zod';
import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { ChangeEventHandler, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { StoreType } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { Card, CardProps, Divider, Flex, H1, TokenInput, TokenInputProps } from '@/component-library';
import { AuthCTA } from '@/components/AuthCTA';
import validate from '@/lib/form-validation';
import { SwapPair, SwapSlippage } from '@/types/swap';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { useSwapFormData } from '../../hooks/use-swap-form-data';
import { SlippageManager } from '../SlippageManager';
import { SwapInfo } from '../SwapInfo';
import { SwapDivider } from './SwapDivider';

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

enum FormFields {
  INPUT_AMOUNT = 'input-amount',
  INPUT_TICKER = 'input-ticker',
  OUTPUT_AMOUNT = 'output-amount',
  OUTPUT_TICKER = 'output-ticker'
}

type SwapFormData = {
  [FormFields.INPUT_AMOUNT]: string;
  [FormFields.INPUT_TICKER]: string;
  [FormFields.OUTPUT_AMOUNT]: string;
  [FormFields.OUTPUT_TICKER]: string;
};

type Props = {
  pair: SwapPair;
  onChangePair: (pair: SwapPair) => void;
};

type InheritAttrs = CardProps & Props;

type SwapFormProps = Props & InheritAttrs;

const SwapForm = ({ pair, onChangePair, ...props }: SwapFormProps): JSX.Element | null => {
  const { t } = useTranslation();
  const [slippage, setSlippage] = useState<SwapSlippage>('0.1%');
  const prices = useGetPrices();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const { data: currencies, getCurrencyFromTicker } = useGetCurrencies(bridgeLoaded);
  const { getAvailableBalance } = useGetBalances();

  const tokens: TokenInputProps['tokens'] = currencies?.map((currency) => ({
    balance: getAvailableBalance(currency.ticker)?.toBig().toNumber() || 0,
    balanceUSD: formatUSD(getTokenPrice(prices, currency.ticker)?.usd || 0),
    ticker: currency.ticker
  }));

  const { input: inputSchema, output: outputSchema } = useSwapFormData(pair);

  const schema = z.object({
    ...(inputSchema && { [FormFields.INPUT_AMOUNT]: validate.amm.swap(t, inputSchema.schema) }),
    ...(outputSchema && { [FormFields.OUTPUT_AMOUNT]: validate.amm.swap(t, outputSchema.schema) })
  });

  const {
    register,
    handleSubmit: h,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<SwapFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema)
    // values: {
    //   'input-ticker': pair.input?.ticker || '',
    //   'output-ticker': pair.output?.ticker || '',
    //   'input-amount': '',
    //   'output-amount': ''
    // }
  });

  // // Callback version of watch.  It's your responsibility to unsubscribe when done.
  // React.useEffect(() => {
  //   const subscription = watch((value, { name, type }) => console.log(value, name, type));
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  const data = watch();

  const inputAmount = Number(data['input-amount']) || 0;

  const handleSubmit = (data: SwapFormData) => {
    try {
      const inputAmount = data['input-amount'] || 0;
      const outputAmount = data['output-amount'] || 0;

      console.log(pair.input, inputAmount);
      console.log(pair.output, outputAmount);
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  const handleTickerChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value: ticker, name } = e.target;

    const currency = getCurrencyFromTicker(ticker);
    const newPair = getPairChange(pair, currency, name);

    onChangePair(newPair);
  };

  const hasCompletePair = !!(pair.input && pair.output);

  const isBtnDisabled = !isValidForm(errors) || !isDirty || !isValid || !hasCompletePair;

  const inputValueUSD = pair.input
    ? convertMonetaryAmountToValueInUSD(
        newMonetaryAmount(inputAmount, pair.input, true),
        getTokenPrice(prices, pair.input.ticker)?.usd
      ) || 0
    : 0;
  const outputValueUSD = pair.output
    ? convertMonetaryAmountToValueInUSD(
        newMonetaryAmount(inputAmount, pair.output, true),
        getTokenPrice(prices, pair.output.ticker)?.usd
      ) || 0
    : 0;

  console.log(data);

  return (
    <Card {...props} gap='spacing2'>
      <H1 size='base' color='secondary' weight='bold' align='center'>
        Swap
      </H1>
      <Divider orientation='horizontal' color='secondary' />
      <Flex direction='column'>
        <SlippageManager value={slippage} onChange={(slippage) => setSlippage(slippage)} />
        <form onSubmit={h(handleSubmit)}>
          <Flex direction='column' gap='spacing4'>
            <Flex direction='column' gap='spacing12'>
              <TokenInput
                placeholder='0.00'
                errorMessage={getErrorMessage(errors['input-amount'])}
                label='From'
                valueUSD={inputValueUSD}
                balance={inputSchema?.balance || 0}
                tokens={tokens}
                selectProps={{
                  value: pair.input?.ticker || '',
                  ...register('input-ticker', {
                    onChange: handleTickerChange
                  })
                }}
                {...register(
                  FormFields.INPUT_AMOUNT
                  //   {
                  //   onChange: (e) => setValue('output-amount', e.target.value as never, { shouldValidate: true })
                  // }
                )}
              />
              <SwapDivider />
              <TokenInput
                placeholder='0.00'
                errorMessage={getErrorMessage(errors['output-amount'])}
                label='To'
                valueUSD={outputValueUSD}
                balance={outputSchema?.balance || 0}
                tokens={tokens}
                isReadOnly
                selectProps={{
                  value: pair.output?.ticker || '',
                  ...register('output-ticker', {
                    onChange: handleTickerChange
                  })
                }}
                {...register(FormFields.OUTPUT_AMOUNT, { valueAsNumber: true })}
              />
            </Flex>
            {hasCompletePair && <SwapInfo pair={pair} />}
            <AuthCTA type='submit' disabled={isBtnDisabled} fullWidth>
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
