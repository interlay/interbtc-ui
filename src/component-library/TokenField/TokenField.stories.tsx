import { Story, Meta } from '@storybook/react';

import { TokenField, TokenFieldProps } from '.';

const Template: Story<TokenFieldProps> = (args) => <TokenField {...args} />;

const WithBalance = Template.bind({});
WithBalance.args = {
  tokenSymbol: 'KSM',
  valueInUSD: '100.00',
  defaultValue: '100.00', // `value`
  balance: '1000.00'
};

const WithoutBalance = Template.bind({});
WithoutBalance.args = {
  tokenSymbol: 'KSM',
  valueInUSD: '100.00',
  defaultValue: '100.00' // `value`
};

export { WithBalance, WithoutBalance };

export default {
  title: 'Forms/TokenFieldWithBalance',
  component: TokenField
} as Meta;
