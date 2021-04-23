
import {
  Story,
  Meta
} from '@storybook/react';

import Tabs from './';

const Template: Story = args => <Tabs {...args} />;

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'Tabs',
  component: Tabs
} as Meta;
