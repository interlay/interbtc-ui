import { Meta, Story } from '@storybook/react';

import { StrategyBanner, StrategyBannerProps } from '.';

const Template: Story<StrategyBannerProps> = (args) => <StrategyBanner {...args} />;

const Default = Template.bind({});
Default.args = {
  title: 'Deposit IBTC & earn Dot',
  description:
    'Earn daily staking rewards by depositing IBTC and receiving auto compounding vDOT. Low management required.'
};

export { Default };

export default {
  title: 'Components/StrategyBanner',
  component: StrategyBanner
} as Meta;
