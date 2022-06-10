import { Meta,Story } from '@storybook/react';

import { CTALink, CTALinkProps } from './';

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

const FullWidth = Template.bind({});
FullWidth.args = {
  variant: 'primary',
  children: 'Call to action',
  fullWidth: true
};

export { FullWidth,Primary, Secondary };

export default {
  title: 'Elements/CTALink',
  component: CTALink
} as Meta;
