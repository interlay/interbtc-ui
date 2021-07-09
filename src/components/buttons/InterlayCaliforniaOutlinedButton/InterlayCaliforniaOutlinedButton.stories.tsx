
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayCaliforniaOutlinedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayCaliforniaOutlinedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayCaliforniaOutlinedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayCaliforniaOutlinedButton',
  component: InterlayCaliforniaOutlinedButton
} as Meta;
