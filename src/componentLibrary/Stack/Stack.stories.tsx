import { Story, Meta } from '@storybook/react';

import { Stack, StackProps } from './';

const Template: Story<StackProps> = (args) => <Stack {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'Stack children'
};

export { Default };

export default {
  title: 'Layout/Stack',
  component: Stack
} as Meta;
