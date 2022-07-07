import { Story, Meta } from '@storybook/react';

import { TokenFieldWithBalance, TokenFieldWithBalanceProps } from './';
import { CurrencySymbols } from 'types/currency';

const Template: Story<TokenFieldWithBalanceProps> = (args) => <TokenFieldWithBalance {...args} />;

const Default = Template.bind({});
Default.args = {
  // ray test touch <
  tokenSymbol: 'KSM',
  currencySymbol: CurrencySymbols.KSM,
  valueInUSD: '100.00',
  usdValue: '100.00',
  currencyValue: '100.00',
  defaultValue: '100.00' // `value`
  // ray test touch >
};

export { Default };

export default {
  title: 'Forms/TokenFieldWithBalance',
  component: TokenFieldWithBalance
} as Meta;
