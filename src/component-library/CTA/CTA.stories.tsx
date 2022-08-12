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
  title: 'Elements/CTA',
  component: CTA
} as Meta;
