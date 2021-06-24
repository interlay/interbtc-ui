
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayRoseOutlinedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayRoseOutlinedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayRoseOutlinedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayRoseOutlinedButton',
  component: InterlayRoseOutlinedButton
} as Meta;
