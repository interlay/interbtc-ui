import { Story, Meta } from '@storybook/react';

import { Stack } from './';

const Template: Story = () => <Stack />;

const Default = Template.bind({});

export { Default };

export default {
  title: 'Layout/Stack',
  component: Stack
} as Meta;
