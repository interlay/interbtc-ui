import { Meta, Story } from '@storybook/react';

import { Icon, IconProps } from '.';

const Template: Story<IconProps> = (args) => <Icon {...args} />;

const Close = Template.bind({});
Close.args = {
  variant: 'close'
};

const Checkmark = Template.bind({});
Checkmark.args = {
  variant: 'checkmark'
};

const CheckCircle = Template.bind({});
CheckCircle.args = {
  variant: 'check-circle'
};

export { CheckCircle, Checkmark, Close };

export default {
  title: 'Elements/Icon',
  component: Icon
} as Meta;
