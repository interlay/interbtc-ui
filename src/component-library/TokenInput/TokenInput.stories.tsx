import { Meta, Story } from '@storybook/react';

import { formatUSD } from '@/common/utils/utils';

import { TokenInput, TokenInputProps } from '.';

const Template: Story<TokenInputProps> = (args) => <TokenInput aria-label='token field' {...args} />;

const WithBalance = Template.bind({});
WithBalance.args = {
  tokenSymbol: 'KSM',
  valueInUSD: formatUSD(100.0),
  balance: 1000.0,
  balanceInUSD: formatUSD(1000.0),
  isDisabled: false,
  decimals: 8,
  renderBalance: (value) => Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 }).format(value),
  label: 'Available Balance'
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
