import { Story, Meta } from '@storybook/react';
// ray test touch <
import { CurrencyIdLiteral } from '@interlay/interbtc-api';
// ray test touch >

import { VaultCard, VaultCardProps } from '.';

const Template: Story<VaultCardProps> = (args) => <VaultCard {...args} />;

const Default = Template.bind({});
Default.args = {
  // ray test touch <
  collateralSymbol: CurrencyIdLiteral.DOT,
  wrappedSymbol: 'BTC',
  // ray test touch >
  pendingRequests: 3,
  apy: '16.23',
  collateralScore: '115.45',
  link: '#'
};

export { Default };

export default {
  title: 'Components/VaultCard',
  component: VaultCard
} as Meta;
