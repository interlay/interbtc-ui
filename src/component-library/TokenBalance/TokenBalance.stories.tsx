import { Meta, Story } from '@storybook/react';

import { TokenBalance, TokenBalanceProps } from '.';

const Template: Story<TokenBalanceProps> = (args) => <TokenBalance {...args} />;

const Default = Template.bind({});
Default.args = {
  tokenSymbol: 'KSM',
  value: '123.22',
  valueInUSD: '23.796'
};

export { Default };

export default {
  title: 'Elements/TokenBalance',
  component: TokenBalance
} as Meta;
