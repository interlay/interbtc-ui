import { Meta, Story } from '@storybook/react';

import { CoinIcon, CoinIconProps } from './CoinIcon';

const Template: Story<CoinIconProps> = (args) => <CoinIcon {...args} />;

const Default = Template.bind({});
Default.args = {
  ticker: 'IBTC'
};

export { Default };

export default {
  title: 'Elements/CoinIcon',
  component: CoinIcon
} as Meta;
