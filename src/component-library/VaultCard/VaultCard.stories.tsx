import { Story, Meta } from '@storybook/react';
import { CurrencyIdLiteral } from '@interlay/interbtc-api';

import { VaultCard, VaultCardProps } from '.';

const Template: Story<VaultCardProps> = (args) => <VaultCard {...args} />;

const Default = Template.bind({});
Default.args = {
  collateralSymbol: CurrencyIdLiteral.DOT,
  wrappedSymbol: 'BTC',
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
