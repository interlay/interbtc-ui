
// ray test touch <<
import {
  Story,
  Meta
} from '@storybook/react';

import Sidebar from './';

const Template: Story = args => <Sidebar {...args} />;

const Default = Template.bind({});
Default.args = {};

export {
  Sidebar
};

export default {
  title: 'Sidebar',
  component: Sidebar
} as Meta;
// ray test touch >>
