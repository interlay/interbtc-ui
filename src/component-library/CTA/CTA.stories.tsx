import { Meta, Story } from '@storybook/react';

import { CTA, CTAProps } from '.';

const Template: Story<CTAProps> = (args) => <CTA {...args} />;

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

const Text = Template.bind({});
Text.args = {
  variant: 'text',
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

const Large = Template.bind({});
Large.args = {
  variant: 'primary',
  size: 'large',
  children: 'Call to action'
};

const Loading = Template.bind({});
Loading.args = {
  variant: 'primary',
  loading: true,
  children: 'Call to action'
};

export { FullWidth, Large, Loading, Outlined, Primary, Secondary, Small, Text };

export default {
  title: 'Elements/CTA',
  component: CTA
} as Meta;
