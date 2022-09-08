import { Meta, Story } from '@storybook/react';

import { Link, LinkProps } from '.';

const Template: Story<LinkProps> = (args) => <Link {...args} />;

const Default = Template.bind({});
Default.args = {
  href: '#',
  children: 'Call to action'
};

export { Default };

export default {
  title: 'Elements/Link',
  component: Link
} as Meta;
