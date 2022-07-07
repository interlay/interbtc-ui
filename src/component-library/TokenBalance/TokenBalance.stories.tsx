import { Story, Meta } from '@storybook/react';

import { CurrencySymbols } from 'types/currency';
import { TokenBalance, TokenBalanceProps } from '.';

const Template: Story<TokenBalanceProps> = (args) => <TokenBalance {...args} />;

const Default = Template.bind({});
Default.args = {
  tokenSymbol: CurrencySymbols.IBTC,
  value: '123.22',
  valueInUSD: '23.796'
};

export { Default };

export default {
  title: 'Elements/TokenBalance',
  component: TokenBalance
} as Meta;
