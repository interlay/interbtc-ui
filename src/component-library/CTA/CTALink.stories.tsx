import { Meta, Story } from '@storybook/react';

import { CTALink, CTALinkProps } from '.';

const Template: Story<CTALinkProps> = (args) => <CTALink {...args} />;

const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  children: 'Call to action',
  external: true
};

const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  children: 'Call to action',
  external: true
};

const Outlined = Template.bind({});
Outlined.args = {
  variant: 'outlined',
  children: 'Call to action',
  external: true
};

const FullWidth = Template.bind({});
FullWidth.args = {
  variant: 'primary',
  children: 'Call to action',
  fullWidth: true,
  external: true
};

const Small = Template.bind({});
Small.args = {
  variant: 'primary',
  size: 'small',
  children: 'Call to action',
  external: true
};

const Large = Template.bind({});
Large.args = {
  variant: 'primary',
  size: 'large',
  children: 'Call to action',
  external: true
};

export { FullWidth, Large, Outlined, Primary, Secondary, Small };

export default {
  title: 'Elements/CTALink',
  component: CTALink
} as Meta;
