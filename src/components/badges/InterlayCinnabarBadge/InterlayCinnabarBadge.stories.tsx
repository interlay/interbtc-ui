
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayCinnabarBadge from '.';

const Template: Story = args => <InterlayCinnabarBadge {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayCinnabarBadge'
};

export {
  Default
};

export default {
  title: 'badges/InterlayCinnabarBadge',
  component: InterlayCinnabarBadge
} as Meta;
