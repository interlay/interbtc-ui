import { CurrencyIdLiteral } from '@interlay/interbtc-api';
import {
  Story,
  Meta
} from '@storybook/react';

import { CoinPair, CoinPairProps } from './';

const Template: Story<CoinPairProps> = args => <CoinPair {...args} />;

const Small = Template.bind({});
Small.args = {
  coinOne: CurrencyIdLiteral.KSM,
  coinTwo: CurrencyIdLiteral.KBTC,
  size: 'small'
};

const Large = Template.bind({});
Large.args = {
  coinOne: CurrencyIdLiteral.KSM,
  coinTwo: CurrencyIdLiteral.KBTC,
  size: 'large'
};

export {
  Small,
  Large
};

export default {
  title: 'Elements/CoinPair',
  component: CoinPair
} as Meta;
