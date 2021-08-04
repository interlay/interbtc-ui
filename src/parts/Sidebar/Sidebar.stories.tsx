
import {
  Story,
  Meta
} from '@storybook/react';

import Sidebar, { Props } from './';

const Template: Story<Props> = args => <Sidebar {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'children'
};

export {
  Sidebar
};

export default {
  title: 'parts/Sidebar',
  component: Sidebar
} as Meta;
