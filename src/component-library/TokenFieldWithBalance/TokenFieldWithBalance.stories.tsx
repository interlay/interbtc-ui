// ray test touch <
import { Story, Meta } from '@storybook/react';

import { TokenFieldWithBalance, TokenFieldWithBalanceProps } from './';
import { CurrencySymbols } from 'types/currency';

const Template: Story<TokenFieldWithBalanceProps> = (args) => <TokenFieldWithBalance {...args} />;

const Default = Template.bind({});
Default.args = {
  label: 'KSM',
  currencySymbol: CurrencySymbols.KSM,
  approxUSD: '100.00',
  usdValue: '100.00',
  currencyValue: '100.00',
  defaultValue: '100.00' // `value`
};

export { Default };

export default {
  title: 'Forms/TokenFieldWithBalance',
  component: TokenFieldWithBalance
} as Meta;
// ray test touch >
