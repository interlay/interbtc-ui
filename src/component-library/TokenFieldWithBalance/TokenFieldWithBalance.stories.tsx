import { Story, Meta } from '@storybook/react';

import { TokenFieldWithBalance, TokenFieldWithBalanceProps } from './';

const Template: Story<TokenFieldWithBalanceProps> = (args) => <TokenFieldWithBalance {...args} />;

const Default = Template.bind({});
Default.args = {
  tokenSymbol: 'KSM',
  valueInUSD: '100.00',
  defaultValue: '100.00', // `value`
  balanceValue: '1000.00',
  balanceValueInUSD: '1000.00'
};

export { Default };

export default {
  title: 'Forms/TokenFieldWithBalance',
  component: TokenFieldWithBalance
} as Meta;
