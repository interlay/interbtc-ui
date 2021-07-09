
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayDefaultOutlinedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayDefaultOutlinedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayDefaultOutlinedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayDefaultOutlinedButton',
  component: InterlayDefaultOutlinedButton
} as Meta;
