import { Meta, Story } from '@storybook/react';

import { useForm } from '@/lib/form';
import Yup from '@/lib/form/yup.custom';

import { TokenInput, TokenInputProps } from '.';

const SwapSchema = Yup.object().shape({
  deposit: Yup.mixed()
});

const Template: Story<TokenInputProps> = () => {
  const formik = useForm({
    initialValues: { deposit: undefined, output: undefined },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
    // params: {
    //   availableBalance: newMonetaryAmount(new Big(10), WRAPPED_TOKEN, true),
    //   transactionFee: newMonetaryAmount(new Big(11), WRAPPED_TOKEN, true)
    // },
    validationSchema: SwapSchema
  });

  return (
    <div>
      <h1>Anywhere in your app!</h1>
      <form onSubmit={formik.handleSubmit}>
        <TokenInput
          name='deposit'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.deposit}
          aria-label='token field'
          valueUSD={(formik.values.deposit || 0) * 10}
          errorMessage={formik.errors.deposit}
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
  );
};

const WithBalance = Template.bind({});
WithBalance.args = {
  defaultTicker: 'KSM',
  balance: 1000.0,
  decimals: 8,
  balanceLabel: 'Balance',
  placeholder: '0.00',
  label: 'Amount',
  isDisabled: false
};

const WithoutBalance = Template.bind({});
WithoutBalance.args = {
  defaultTicker: 'KSM',
  label: 'Amount',
  placeholder: '0.00',
  isDisabled: false
};

const WithCurrencySelect = Template.bind({});
WithCurrencySelect.args = {
  balance: 1000.0,
  isDisabled: false,
  decimals: 8,
  balanceLabel: 'Balance',
  placeholder: '0.00',
  label: 'From',
  tokens: [
    { balance: 200, ticker: 'KSM', balanceUSD: '$200' },
    { balance: 200, ticker: 'BTC', balanceUSD: '$200' },
    { balance: 200, ticker: 'IBTC', balanceUSD: '$200' },
    { balance: 200, ticker: 'KBTC', balanceUSD: '$200' },
    { balance: 200, ticker: 'DOT', balanceUSD: '$200' },
    { balance: 200, ticker: 'INTR', balanceUSD: '$200' },
    { balance: 200, ticker: 'LKSM', balanceUSD: '$200' }
  ]
};

const MultiToken = Template.bind({});
MultiToken.args = {
  ticker: { text: 'LP Token', icons: ['KSM', 'KBTC', 'KINT', 'USDT'] },
  balance: 1000.0,
  decimals: 8,
  balanceLabel: 'Balance',
  placeholder: '0.00',
  label: 'Amount',
  isDisabled: false,
  tokens: [
    { balance: 200, ticker: 'KSM', balanceUSD: '$200' },
    { balance: 200, ticker: 'BTC', balanceUSD: '$200' },
    { balance: 200, ticker: 'IBTC', balanceUSD: '$200' },
    { balance: 200, ticker: 'KBTC', balanceUSD: '$200' },
    { balance: 200, ticker: 'DOT', balanceUSD: '$200' },
    { balance: 200, ticker: 'INTR', balanceUSD: '$200' },
    { balance: 200, ticker: { text: 'LP Token', icons: ['KSM', 'KBTC', 'KINT', 'USDT'] }, balanceUSD: '$200' }
  ]
};

export { MultiToken, WithBalance, WithCurrencySelect, WithoutBalance };

export default {
  title: 'Forms/TokenInput',
  component: TokenInput
} as Meta;
