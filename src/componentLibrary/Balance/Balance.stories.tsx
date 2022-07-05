import { Story, Meta } from '@storybook/react';

import { Balance, BalanceProps } from '.';

const Template: Story<BalanceProps> = (args) => <Balance {...args} />;

const Default = Template.bind({});
Default.args = {
  currencySymbol: 'IBTC',
  currencyValue: '123.22',
  usdValue: '23.796'
};

export { Default };

export default {
  title: 'Elements/Balance',
  component: Balance
} as Meta;
