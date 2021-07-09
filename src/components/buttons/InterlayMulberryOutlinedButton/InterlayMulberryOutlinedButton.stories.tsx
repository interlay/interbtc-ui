
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayMulberryOutlinedButton, { Props } from '.';

const Template: Story<Props> = args => <InterlayMulberryOutlinedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'InterlayMulberryOutlinedButton'
};

export {
  Default
};

export default {
  title: 'buttons/InterlayMulberryOutlinedButton',
  component: InterlayMulberryOutlinedButton
} as Meta;
