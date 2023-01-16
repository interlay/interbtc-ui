import { Meta, Story } from '@storybook/react';
import { useState } from 'react';

import { TokenInput, TokenInputProps } from '.';

const Template: Story<TokenInputProps> = (args) => {
  const [value, setValue] = useState<number>();

  return (
    <TokenInput
      {...args}
      value={value}
      onChange={(e) => setValue(Number(e.target.value) || undefined)}
      aria-label='token field'
      valueUSD={(value || 0) * 10}
    />
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
  isDisabled: true
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
