import { Meta,Story } from '@storybook/react';

import { H4, H4Props } from '.';

const Template: Story<H4Props> = (args) => <H4 {...args} />;

const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  children: 'Primary heading 4'
};

const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  children: 'Secondary heading 4'
};

const Tertiary = Template.bind({});
Tertiary.args = {
  color: 'tertiary',
  children: 'Tertiary heading 4'
};

export { Primary, Secondary, Tertiary };

export default {
  title: 'Text/H4',
  component: H4
} as Meta;
