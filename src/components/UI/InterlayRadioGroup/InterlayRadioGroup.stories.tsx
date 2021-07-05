
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayRadioGroup from './';

const Template: Story = args => <InterlayRadioGroup {...args} />;

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'UI/InterlayRadioGroup',
  component: InterlayRadioGroup
} as Meta;
