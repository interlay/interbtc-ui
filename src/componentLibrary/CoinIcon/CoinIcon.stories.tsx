import { Meta,Story } from '@storybook/react';

import { CurrencySymbols } from '@/types/currency';

import { CoinIcon, CoinIconProps } from '.';

const Template: Story<CoinIconProps> = (args) => <CoinIcon {...args} />;

const Default = Template.bind({});
Default.args = {
  coin: CurrencySymbols.KBTC,
  size: 'small'
};

export { Default };

export default {
  title: 'Elements/CoinIcon',
  component: CoinIcon
} as Meta;
