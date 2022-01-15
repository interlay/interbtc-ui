
// ray test touch <<
import {
  Story,
  Meta
} from '@storybook/react';

import FarmersOnlyToast from '.';

const Template: Story = args => (
  <FarmersOnlyToast {...args}>
    Hi
  </FarmersOnlyToast>
);

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'UI/FarmersOnlyToast',
  component: FarmersOnlyToast
} as Meta;
// ray test touch >>
