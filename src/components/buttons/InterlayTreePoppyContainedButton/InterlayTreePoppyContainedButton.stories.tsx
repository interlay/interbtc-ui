
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayTreePoppyContainedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayTreePoppyContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayTreePoppyContainedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayTreePoppyContainedButton',
  component: InterlayTreePoppyContainedButton
} as Meta;
