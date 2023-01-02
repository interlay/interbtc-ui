import { newMonetaryAmount } from '@interlay/interbtc-api';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Card, CardProps, Divider, Flex, H1, TokenInput, TokenInputProps } from '@/component-library';
import { AuthCTA } from '@/components/AuthCTA';
import { SwapPair } from '@/types/swap';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { SlippageManager } from '../SlippageManager';
import { SwapInfo } from '../SwapInfo';
import { SwapDivider } from './SwapDivider';

// const getSwapMonetaryAmount = (data: SwapFormData, pair: SwapPair) => {
//   const inputAmount = data['input-amount'] || 0;
//   const outputAmount = data['output-amount'] || 0;

//   return {
//     input: newMonetaryAmount(inputAmount, pair.input, true),
//     output: newMonetaryAmount(outputAmount, pair.output, true)
//   };
// };

const useFormInputProps = (
  pair: SwapPair,
  data: SwapFormData
): {
  outputProps: Pick<TokenInputProps, 'balance' | 'valueInUSD'>;
  inputProps: Pick<TokenInputProps, 'balance' | 'valueInUSD'>;
} => {
  const { getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();

  const inputAmount = data['input-amount'] || 0;
  const outputAmount = data['output-amount'] || 0;

  const inputProps = pair.input
    ? {
        balance: getAvailableBalance(pair.input.ticker)?.toBig().toNumber() || 0,
        valueInUSD: displayMonetaryAmountInUSDFormat(
          newMonetaryAmount(inputAmount, pair.input, true),
          getTokenPrice(prices, pair.input.ticker)?.usd
        )
      }
    : { valueInUSD: '-' };

  const outputProps = pair.output
    ? {
        balance: getAvailableBalance(pair.output.ticker)?.toBig().toNumber() || 0,
        valueInUSD: displayMonetaryAmountInUSDFormat(
          newMonetaryAmount(outputAmount, pair.output, true),
          getTokenPrice(prices, pair.output.ticker)?.usd
        )
      }
    : { valueInUSD: '-' };

  return {
    outputProps,
    inputProps
  };
};

enum FormFields {
  INPUT_AMOUNT = 'input-amount',
  OUTPUT_AMOUNT = 'output-amount'
}

type SwapFormData = {
  [FormFields.INPUT_AMOUNT]: string;
  [FormFields.OUTPUT_AMOUNT]: string;
};

type Props = {
  pair: SwapPair;
  onChangePair: (pair: SwapPair) => void;
};

type InheritAttrs = CardProps & Props;

type SwapFormProps = Props & InheritAttrs;

const SwapForm = ({ pair, onChangePair, ...props }: SwapFormProps): JSX.Element | null => {
  const {
    register,
    handleSubmit: h,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<SwapFormData>({
    mode: 'onChange'
  });

  const data = watch();
  const { inputProps, outputProps } = useFormInputProps(pair, data);

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

  const handleClickSwitch = () => {
    onChangePair({ input: pair.output, output: pair.input });
  };

  const hasOutput = !!pair.output;
  const isBtnDisabled = !isValidForm(errors) || !isDirty || !isValid || !hasOutput;

  return (
    <Card {...props} gap='spacing2'>
      <H1 size='base' color='secondary' weight='bold' align='center'>
        Swap
      </H1>
      <Divider orientation='horizontal' color='secondary' />
      <Flex direction='column'>
        <SlippageManager />
        <form onSubmit={h(handleSubmit)}>
          <Flex direction='column' gap='spacing4'>
            <Flex direction='column' gap='spacing12'>
              <TokenInput
                placeholder='0.00'
                tokenSymbol={pair.input?.ticker || ''}
                errorMessage={getErrorMessage(errors['input-amount'])}
                label='From'
                {...inputProps}
                {...register(FormFields.INPUT_AMOUNT)}
              />
              <SwapDivider onClickSwitch={handleClickSwitch} />
              <TokenInput
                placeholder='0.00'
                tokenSymbol={pair.output?.ticker || ''}
                errorMessage={getErrorMessage(errors['output-amount'])}
                label='To'
                {...outputProps}
                {...register(FormFields.OUTPUT_AMOUNT)}
              />
            </Flex>
            {hasOutput && <SwapInfo />}
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
