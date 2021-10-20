
// ray test touch <<
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayTabs from './';

const Template: Story = args => <InterlayTabs {...args} />;

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'UI/InterlayTabs',
  component: InterlayTabs
} as Meta;
// ray test touch >>
