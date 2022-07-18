import { Meta,Story } from '@storybook/react';

import { Icon, IconProps } from '.';

const Template: Story<IconProps> = (args) => <Icon {...args} />;

const Close = Template.bind({});
Close.args = {
  variant: 'close'
};

const CheckMark = Template.bind({});
CheckMark.args = {
  variant: 'checkmark'
};

export { CheckMark,Close };

export default {
  title: 'Elements/Icon',
  component: Icon
} as Meta;
