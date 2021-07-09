
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayDefaultContainedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayDefaultContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayDefaultContainedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayDefaultContainedButton',
  component: InterlayDefaultContainedButton
} as Meta;
