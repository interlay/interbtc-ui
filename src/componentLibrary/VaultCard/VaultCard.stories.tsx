import {
  Story,
  Meta
} from '@storybook/react';

import { VaultCard, VaultCardProps } from './';

const Template: Story<VaultCardProps> = args => <VaultCard {...args} />;

const Default = Template.bind({});
Default.args = {
  collateral: 'btc',
  wrappedAsset: 'lksm',
  pendingRequests: 3,
  apy: '16.23',
  collateralScore: '115.45'
};

export {
  Default
};

export default {
  title: 'Components/VaultCard',
  component: VaultCard
} as Meta;
