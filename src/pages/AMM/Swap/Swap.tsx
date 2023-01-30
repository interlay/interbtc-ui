import { isCurrencyEqual } from '@interlay/interbtc-api';
import { chain } from '@react-aria/utils';
import { useFormik } from 'formik';
import { ChangeEventHandler, useEffect, useState } from 'react';
import * as Yup from 'yup';

import { TokenInput } from '@/component-library';
import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { SwapPair } from '@/types/swap';
import { useGetLiquidityPools } from '@/utils/hooks/api/amm/use-get-liquidity-pools';

import { SwapForm, SwapLiquidity } from './components';
import { StyledWrapper } from './Swap.style';

// Example of resuable schema
const MegaFailSchema = Yup.string().test({
  name: 'match',
  message: 'Big fail',
  test: (value, ctx) => {
    if (value === '123') {
      return ctx.createError({ message: 'Thats a fail' });
    }

    return true;
  }
});

const Swap = (): JSX.Element => {
  const { data: liquidityPools, refetch } = useGetLiquidityPools();
  const [pair, setPair] = useState<SwapPair>({ input: RELAY_CHAIN_NATIVE_TOKEN });

  const SwapSchema = Yup.object().shape({
    input: Yup.string().max(5, 'Too Long!').concat(MegaFailSchema)
  });

  const formik = useFormik({
    initialValues: { input: undefined, output: undefined },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
    validationSchema: SwapSchema
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    formik.setFieldValue('output', e.target.value, true);
    setTimeout(() => formik.validateField('input'));
  };

  // https://github.com/jaredpalmer/formik/issues/2083#issuecomment-571259235
  useEffect(() => {
    formik.validateForm(formik.values);
  }, [formik.values]);

  if (liquidityPools === undefined) {
    return <FullLoadingSpinner />;
  }

  const liquidityPool = liquidityPools.find(
    (obj) =>
      obj.pooledCurrencies.some((amount) => pair.input && isCurrencyEqual(amount.currency, pair.input)) &&
      obj.pooledCurrencies.some((amount) => pair.output && isCurrencyEqual(amount.currency, pair.output))
  );

  const handleChangePair = (pair: SwapPair) => setPair(pair);

  return (
    <MainContainer>
      <StyledWrapper direction='column' gap='spacing8'>
        <SwapForm pair={pair} liquidityPools={liquidityPools} onChangePair={handleChangePair} onSwap={refetch} />
        {pair.input && pair.output && liquidityPool && (
          <SwapLiquidity input={pair.input} output={pair.output} liquidityPool={liquidityPool} />
        )}
      </StyledWrapper>

      <div>
        <h1>Anywhere in your app!</h1>
        <form onSubmit={formik.handleSubmit}>
          <TokenInput
            name='input'
            onChange={chain(formik.handleChange, handleChange)}
            onBlur={formik.handleBlur}
            value={formik.values.input}
            aria-label='token field'
            valueUSD={(formik.values.input || 0) * 10}
            errorMessage={formik.errors.input}
          />
          <TokenInput
            name='output'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.output}
            aria-label='token field'
            valueUSD={(formik.values.output || 0) * 10}
          />
          <button type='submit' disabled={formik.isSubmitting}>
            Submit
          </button>
        </form>
      </div>
    </MainContainer>
  );
};

export default Swap;
