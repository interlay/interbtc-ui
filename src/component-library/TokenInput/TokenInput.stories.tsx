import { Meta, Story } from '@storybook/react';
import { useState } from 'react';

import { TokenInput, TokenInputProps } from '.';

const Template: Story<TokenInputProps> = (args) => {
  const [value, setValue] = useState<string>();

  return (
    <TokenInput
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      valueUSD={isNaN(value as any) ? 0 : Number(value) * 10}
    />
  );
};

const WithBalance = Template.bind({});
WithBalance.args = {
  ticker: 'KSM',
  balance: 1000.0,
  balanceLabel: 'Balance',
  placeholder: '0.00',
  label: 'Amount',
  isDisabled: false,
  errorMessage: 'test'
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
  balanceLabel: 'Balance',
  placeholder: '0.00',
  label: 'From',
  selectProps: {
    items: [
      { balance: 200, value: 'KSM', balanceUSD: '$200' },
      { balance: 200, value: 'BTC', balanceUSD: '$200' },
      { balance: 200, value: 'IBTC', balanceUSD: '$200' },
      { balance: 200, value: 'KBTC', balanceUSD: '$200' },
      { balance: 200, value: 'DOT', balanceUSD: '$200' },
      { balance: 200, value: 'INTR', balanceUSD: '$200' },
      { balance: 200, value: 'LKSM', balanceUSD: '$200' }
    ]
  }
};

const MultiToken = Template.bind({});
MultiToken.args = {
  balance: 1000.0,
  balanceLabel: 'Balance',
  placeholder: '0.00',
  label: 'Amount',
  isDisabled: false,
  selectProps: {
    value: 'LP KSM-KBTC-KINT',
    items: [
      { balance: 200, value: 'KSM', balanceUSD: '$200' },
      { balance: 200, value: 'BTC', balanceUSD: '$200' },
      { balance: 200, value: 'IBTC', balanceUSD: '$200' },
      { balance: 200, value: 'KBTC', balanceUSD: '$200' },
      { balance: 200, value: 'DOT', balanceUSD: '$200' },
      { balance: 200, value: 'INTR', balanceUSD: '$200' },
      { balance: 200, value: 'LP KSM-KBTC-KINT', tickers: ['KSM', 'KBTC', 'KINT'], balanceUSD: '$200' }
    ]
  }
  // errorMessage: 'Failed'
};

const SingleItemInSelectItems = Template.bind({});
SingleItemInSelectItems.args = {
  balance: 1000.0,
  balanceLabel: 'Balance',
  placeholder: '0.00',
  label: 'Amount',
  isDisabled: false,
  selectProps: {
    items: [{ balance: 200, value: 'KSM', balanceUSD: '$200' }]
  }
};

export { MultiToken, SingleItemInSelectItems, WithBalance, WithCurrencySelect, WithoutBalance };

export default {
  title: 'Forms/TokenInput',
  component: TokenInput
} as Meta;
