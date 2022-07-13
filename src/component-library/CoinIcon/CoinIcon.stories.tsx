import { Story, Meta } from '@storybook/react';
// ray test touch <
import { CurrencyIdLiteral } from '@interlay/interbtc-api';
// ray test touch >

import { CoinIcon, CoinIconProps } from '.';

const Template: Story<CoinIconProps> = (args) => <CoinIcon {...args} />;

const Default = Template.bind({});
Default.args = {
  // ray test touch <
  coin: CurrencyIdLiteral.INTERBTC,
  // ray test touch >
  size: 'small'
};

export { Default };

export default {
  title: 'Elements/CoinIcon',
  component: CoinIcon
} as Meta;
