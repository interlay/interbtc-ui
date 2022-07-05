import { Story, Meta } from '@storybook/react';

import { Icon, IconProps } from '.';

const Template: Story<IconProps> = (args) => <Icon {...args} />;

const Default = Template.bind({});
Default.args = {
  variant: 'close'
};

export { Default };

export default {
  title: 'Elements/Icon',
  component: Icon
} as Meta;
