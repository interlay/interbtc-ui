import { Meta, Story } from '@storybook/react';

import { CTALink, CTALinkProps } from '.';

const Template: Story<CTALinkProps> = (args) => <CTALink {...args} />;

const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  children: 'Call to action'
};

const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  children: 'Call to action'
};

const Outlined = Template.bind({});
Outlined.args = {
  variant: 'outlined',
  children: 'Call to action'
};

const FullWidth = Template.bind({});
FullWidth.args = {
  variant: 'primary',
  children: 'Call to action',
  fullWidth: true
};

const Small = Template.bind({});
Small.args = {
  variant: 'primary',
  size: 'small',
  children: 'Call to action'
};

export { FullWidth, Outlined, Primary, Secondary, Small };

export default {
  title: 'Elements/CTALink',
  component: CTALink
} as Meta;
