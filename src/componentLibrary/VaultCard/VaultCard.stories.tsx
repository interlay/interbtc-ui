import {
  Story,
  Meta
} from '@storybook/react';

import { VaultCard, VaultCardProps } from './';

const Template: Story<VaultCardProps> = args => <VaultCard {...args} />;

const Default = Template.bind({});
Default.args = {
  collateral: 'LKSM',
  wrappedAsset: 'KSM',
  pendingRequests: 3,
  apy: 16.23,
  collateralScore: 115.45
};

export {
  Default
};

export default {
  title: 'Component Library/VaultCard',
  component: VaultCard
} as Meta;
