import {
  Story,
  Meta
} from '@storybook/react';

import { CoinPair, CoinPairProps } from './';

const Template: Story<CoinPairProps> = args => <CoinPair {...args} />;

const Small = Template.bind({});
Small.args = {
  coinOne: 'btc',
  coinTwo: 'ksm',
  size: 'small'
};

const Large = Template.bind({});
Large.args = {
  coinOne: 'btc',
  coinTwo: 'ksm',
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
