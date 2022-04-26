import {
  Story,
  Meta
} from '@storybook/react';

import { CoinPair, CoinPairProps } from './';

const Template: Story<CoinPairProps> = args => <CoinPair {...args} />;

const Small = Template.bind({});
Small.args = {
  coinOne: 'BTC',
  coinTwo: 'KSM',
  size: 'small'
};

const Large = Template.bind({});
Large.args = {
  coinOne: 'BTC',
  coinTwo: 'KSM',
  size: 'large'
};

export {
  Small,
  Large
};

export default {
  title: 'Component Library/CoinPair',
  component: CoinPair
} as Meta;
