
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayConiferOutlinedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayConiferOutlinedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayConiferOutlinedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayConiferOutlinedButton',
  component: InterlayConiferOutlinedButton
} as Meta;
