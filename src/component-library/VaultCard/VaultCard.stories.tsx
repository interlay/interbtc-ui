import { Meta, Story } from '@storybook/react';

import { VaultCard, VaultCardProps } from '.';

const Template: Story<VaultCardProps> = (args) => <VaultCard {...args} />;

const Default = Template.bind({});
Default.args = {
  collateralSymbol: 'DOT',
  wrappedSymbol: 'BTC',
  pendingRequests: 3,
  apy: '16.23',
  collateralScore: '115.45',
  link: '#',
  atRisk: false
};

const AtRisk = Template.bind({});
AtRisk.args = {
  collateralSymbol: 'DOT',
  wrappedSymbol: 'BTC',
  pendingRequests: 3,
  apy: '16.23',
  collateralScore: '115.45',
  link: '#',
  atRisk: true
};

export { AtRisk, Default };

export default {
  title: 'Components/VaultCard',
  component: VaultCard
} as Meta;
