
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayCaliforniaContainedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayCaliforniaContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayCaliforniaContainedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayCaliforniaContainedButton',
  component: InterlayCaliforniaContainedButton
} as Meta;
