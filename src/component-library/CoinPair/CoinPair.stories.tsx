import { Meta, Story } from '@storybook/react';

import { CoinPair, CoinPairProps } from '.';

const Template: Story<CoinPairProps> = (args) => <CoinPair {...args} />;

const Small = Template.bind({});
Small.args = {
  coinOne: 'IBTC',
  coinTwo: 'KBTC',
  size: 'small'
};

const Large = Template.bind({});
Large.args = {
  coinOne: 'IBTC',
  coinTwo: 'KBTC',
  size: 'large'
};

export { Large, Small };

export default {
  title: 'Elements/CoinPair',
  component: CoinPair
} as Meta;
