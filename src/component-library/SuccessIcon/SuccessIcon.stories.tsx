// ray test touch <
import { Story, Meta } from '@storybook/react';

import { SuccessIcon, SuccessIconProps } from '.';

const Template: Story<SuccessIconProps> = (args) => <SuccessIcon {...args} />;

const Default = Template.bind({});
Default.args = {};

export { Default };

export default {
  title: 'Elements/SuccessIcon',
  component: SuccessIcon
} as Meta;
// ray test touch >
