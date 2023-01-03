import { Meta, Story } from '@storybook/react';

import { CoinPair, CoinPairProps } from '.';

const Template: Story<CoinPairProps> = (args) => <CoinPair {...args} />;

const Default = Template.bind({});
Default.args = {
  coinOne: 'IBTC',
  coinTwo: 'KBTC',
  size: 'xl2'
};

export { Default };

export default {
  title: 'Elements/CoinPair',
  component: CoinPair
} as Meta;
