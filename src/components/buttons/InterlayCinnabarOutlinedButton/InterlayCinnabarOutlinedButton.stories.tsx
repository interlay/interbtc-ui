
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayCinnabarOutlinedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayCinnabarOutlinedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayCinnabarOutlinedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayCinnabarOutlinedButton',
  component: InterlayCinnabarOutlinedButton
} as Meta;
