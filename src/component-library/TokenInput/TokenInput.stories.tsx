import { Meta, Story } from '@storybook/react';
import { useState } from 'react';

import { TokenInput, TokenInputProps } from '.';

const Template: Story<TokenInputProps> = (args) => {
  const [value, setValue] = useState<number>();

  return (
    <TokenInput
      {...args}
      value={value}
      onChange={(e) => setValue(Number(e.target.value || 0))}
      aria-label='token field'
      valueUSD={(value || 0) * 10}
    />
  );
};

const WithBalance = Template.bind({});
WithBalance.args = {
  ticker: 'KSM',
  balance: 1000.0,
  decimals: 8,
  balanceLabel: 'Balance',
  placeholder: '0.00',
  label: 'Amount',
  isDisabled: false
};

const WithoutBalance = Template.bind({});
WithoutBalance.args = {
  ticker: 'KSM',
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
  selectProps: {},
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

export { WithBalance, WithCurrencySelect, WithoutBalance };

export default {
  title: 'Forms/TokenInput',
  component: TokenInput
} as Meta;
