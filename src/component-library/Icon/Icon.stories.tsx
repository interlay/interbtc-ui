import { Story, Meta } from '@storybook/react';

import { Icon, IconProps } from '.';

const Template: Story<IconProps> = (args) => <Icon {...args} />;

const Close = Template.bind({});
Close.args = {
  variant: 'close'
};

// ray test touch <
const CheckMark = Template.bind({});
CheckMark.args = {
  variant: 'checkmark'
};
// ray test touch >

export { Close, CheckMark };

export default {
  title: 'Elements/Icon',
  component: Icon
} as Meta;
