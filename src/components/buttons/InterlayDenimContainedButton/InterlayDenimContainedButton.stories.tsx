
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayDenimContainedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayDenimContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayDenimContainedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayDenimContainedButton',
  component: InterlayDenimContainedButton
} as Meta;
