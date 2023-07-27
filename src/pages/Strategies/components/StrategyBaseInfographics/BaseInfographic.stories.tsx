import { Meta, Story } from '@storybook/react';

import { BaseInfographics, BaseInfographicsProps } from './BaseInfographics';

const Template: Story<BaseInfographicsProps> = (args) => <BaseInfographics {...args} />;

const Simple = Template.bind({});
Simple.args = {
  items: [
    { ticker: 'IBTC', label: 'Deposit IBTC' },
    {
      ticker: 'USDT',
      subIcon: 'presentation',
      label: 'Provide IBTC to borrow market'
    },
    { ticker: ['USDT', 'IBTC'], subIcon: 'presentation', label: 'Earn interest' }
  ]
};

const Cycle = Template.bind({});
Cycle.args = {
  items: [
    { ticker: 'IBTC', label: 'Deposit IBTC' },
    {
      ticker: 'IBTC',
      subIcon: 'presentation',
      label: 'Provide IBTC to borrow market'
    },
    { ticker: ['IBTC', 'USDT'], subIcon: 'swap', label: 'Earn interest' }
  ],
  isCyclic: true,
  endCycleLabel: 'Repeat 1-5 until desired leverage is achieved'
};

const Icon = Template.bind({});
Icon.args = {
  items: [
    { ticker: 'IBTC', label: 'Deposit IBTC' },
    {
      icon: 'presentation',
      label: 'Provide IBTC to borrow market'
    },
    { ticker: ['IBTC', 'USDT'], subIcon: 'swap', label: 'Earn interest' }
  ],
  isCyclic: true,
  endCycleLabel: 'Repeat 1-5 until desired leverage is achieved'
};

export { Cycle, Icon, Simple };

export default {
  title: 'Components/BaseInfographics',
  component: BaseInfographics
} as Meta;
