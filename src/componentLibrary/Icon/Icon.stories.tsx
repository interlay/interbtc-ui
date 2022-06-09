import { Story, Meta } from '@storybook/react';

import { Icon, IconProps } from '.';

const Template: Story<IconProps> = (args) => <Icon {...args} />;

const Default = Template.bind({});
Default.args = {
  variant: 'close'
};

const WithFillProp = Template.bind({});
WithFillProp.args = {
  variant: 'close',
  fill: '#a51a51'
};

export { Default, WithFillProp };

export default {
  title: 'Elements/Icon',
  component: Icon
} as Meta;
