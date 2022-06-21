import { Story, Meta } from '@storybook/react';

import { CurrencySymbols } from 'types/currency';
import { CoinIcon, CoinIconProps } from '.';

const Template: Story<CoinIconProps> = (args) => <CoinIcon {...args} />;

const Default = Template.bind({});
Default.args = {
  coin: CurrencySymbols.INTERBTC,
  size: 'small'
};

export { Default };

export default {
  title: 'Elements/CoinIcon',
  component: CoinIcon
} as Meta;
