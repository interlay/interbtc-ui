import { Meta, Story } from '@storybook/react';
import { useState } from 'react';

import { formatUSD } from '@/common/utils/utils';

import { TokenInput, TokenInputProps } from '.';

const Template: Story<TokenInputProps> = (args) => {
  const [value, setValue] = useState<number>();

  return (
    <TokenInput
      {...args}
      value={value}
      onChange={(e) => setValue(Number(e.target.value || 0))}
      aria-label='token field'
      valueInUSD={`$${(value || 0) * 10}`}
      onSelectToken={console.log}
      currencies={[
        { balance: 200, currency: 'KSM', usd: '$200' },
        { balance: 200, currency: 'BTC', usd: '$200' }
      ]}
    />
  );
};

const WithBalance = Template.bind({});
WithBalance.args = {
  tokenSymbol: 'KSM',
  balance: 1000.0,
  isDisabled: false,
  decimals: 8,
  balanceLabel: 'Balance',
  placeholder: '0.00',
  label: 'From'
};

const WithoutBalance = Template.bind({});
WithoutBalance.args = {
  tokenSymbol: 'KSM',
  valueInUSD: formatUSD(100.0),
  label: 'Collateral Deposit'
};

export { WithBalance, WithoutBalance };

export default {
  title: 'Forms/TokenInput',
  component: TokenInput
} as Meta;
