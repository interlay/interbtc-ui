import { Story, Meta } from '@storybook/react';

import { CurrencySymbols } from 'types/currency';
import { VaultCard, VaultCardProps } from './';

const Template: Story<VaultCardProps> = (args) => <VaultCard {...args} />;

const Default = Template.bind({});
Default.args = {
  collateralSymbol: CurrencySymbols.KSM,
  wrappedSymbol: CurrencySymbols.KBTC,
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
