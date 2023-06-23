import { Meta, Story } from '@storybook/react';

import { WelcomeBanner, WelcomeBannerProps } from '.';

const Template: Story<WelcomeBannerProps> = (args) => <WelcomeBanner {...args} />;

const Default = Template.bind({});
Default.args = {
  title: 'Deposit IBTC & earn Dot',
  description:
    'Earn daily staking rewards by depositing IBTC and receiving auto compounding vDOT. Low management required.'
};

export { Default };

export default {
  title: 'Components/WelcomeBanner',
  component: WelcomeBanner
} as Meta;
