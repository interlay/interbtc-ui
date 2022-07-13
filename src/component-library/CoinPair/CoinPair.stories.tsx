import { Story, Meta } from '@storybook/react';
// ray test touch <
import { CurrencyIdLiteral } from '@interlay/interbtc-api';
// ray test touch >

import { CoinPair, CoinPairProps } from '.';

const Template: Story<CoinPairProps> = (args) => <CoinPair {...args} />;

const Small = Template.bind({});
Small.args = {
  // ray test touch <
  coinOne: CurrencyIdLiteral.INTERBTC,
  coinTwo: CurrencyIdLiteral.KBTC,
  // ray test touch >
  size: 'small'
};

const Large = Template.bind({});
Large.args = {
  // ray test touch <
  coinOne: CurrencyIdLiteral.INTERBTC,
  coinTwo: CurrencyIdLiteral.KBTC,
  // ray test touch >
  size: 'large'
};

export { Small, Large };

export default {
  title: 'Elements/CoinPair',
  component: CoinPair
} as Meta;
