import { Meta, Story } from '@storybook/react';

import { Coin, CoinProps } from '.';

const Template: Story<CoinProps> = (args) => <Coin {...args} />;

const Default = Template.bind({});
Default.args = {
  ticker: 'IBTC'
};

export { Default };

export default {
  title: 'Elements/Coin',
  component: Coin
} as Meta;
