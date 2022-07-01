import { Story, Meta } from '@storybook/react';

import { CurrencySymbols } from 'types/currency';
import { CoinPair, CoinPairProps } from './';

const Template: Story<CoinPairProps> = (args) => <CoinPair {...args} />;

const Small = Template.bind({});
Small.args = {
  coinOne: CurrencySymbols.IBTC,
  coinTwo: CurrencySymbols.KBTC,
  size: 'small'
};

const Large = Template.bind({});
Large.args = {
  coinOne: CurrencySymbols.IBTC,
  coinTwo: CurrencySymbols.KBTC,
  size: 'large'
};

export { Small, Large };

export default {
  title: 'Elements/CoinPair',
  component: CoinPair
} as Meta;
