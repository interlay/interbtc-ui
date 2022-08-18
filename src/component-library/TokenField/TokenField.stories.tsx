import { Meta, Story } from '@storybook/react';

import { TokenField, TokenFieldProps } from '.';

const Template: Story<TokenFieldProps> = (args) => <TokenField {...args} />;

const WithBalance = Template.bind({});
WithBalance.args = {
  tokenSymbol: 'KSM',
  valueInUSD: 100.0,
  defaultValue: 100.0, // `value`
  balance: {
    value: 1000.0,
    valueInUSD: 1000.0
  }
};

const WithoutBalance = Template.bind({});
WithoutBalance.args = {
  tokenSymbol: 'KSM',
  valueInUSD: 100.0,
  defaultValue: 100.0 // `value`
};

export { WithBalance, WithoutBalance };

export default {
  title: 'Forms/TokenField',
  component: TokenField
} as Meta;
