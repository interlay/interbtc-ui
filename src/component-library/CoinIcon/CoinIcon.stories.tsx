import { Story, Meta } from '@storybook/react';
import { CurrencyIdLiteral } from '@interlay/interbtc-api';

import { CoinIcon, CoinIconProps } from '.';

const Template: Story<CoinIconProps> = (args) => <CoinIcon {...args} />;

const Default = Template.bind({});
Default.args = {
  coin: CurrencyIdLiteral.INTERBTC,
  size: 'small'
};

export { Default };

export default {
  title: 'Elements/CoinIcon',
  component: CoinIcon
} as Meta;
