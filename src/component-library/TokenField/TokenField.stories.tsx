import { Meta, Story } from '@storybook/react';

import { formatUSD } from '@/common/utils/utils';

import { TokenField, TokenFieldProps } from '.';

const Template: Story<TokenFieldProps> = (args) => <TokenField {...args} aria-label='token field' />;

const WithBalance = Template.bind({});
WithBalance.args = {
  tokenSymbol: 'KSM',
  valueInUSD: formatUSD(100.0),
  value: 100.0, // `value`
  balance: 1000.0,
  balanceInUSD: formatUSD(1000.0),
  isDisabled: false
};

const WithoutBalance = Template.bind({});
WithoutBalance.args = {
  tokenSymbol: 'KSM',
  valueInUSD: formatUSD(100.0),
  defaultValue: 100.0 // `value`
};

export { WithBalance, WithoutBalance };

export default {
  title: 'Forms/TokenField',
  component: TokenField
} as Meta;
