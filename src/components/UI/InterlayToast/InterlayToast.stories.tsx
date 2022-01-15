
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayToast from '.';

const Template: Story = args => (
  <InterlayToast {...args}>
    Hi
  </InterlayToast>
);

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'UI/InterlayToast',
  component: InterlayToast
} as Meta;
