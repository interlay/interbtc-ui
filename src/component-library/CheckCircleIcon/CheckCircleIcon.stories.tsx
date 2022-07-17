import { Story, Meta } from '@storybook/react';

import { CheckCircleIcon, CheckCircleIconProps } from '.';

const Template: Story<CheckCircleIconProps> = (args) => <CheckCircleIcon {...args} />;

const Default = Template.bind({});
Default.args = {};

export { Default };

export default {
  title: 'Elements/CheckCircleIcon',
  component: CheckCircleIcon
} as Meta;
