import { Meta, Story } from '@storybook/react';

import { H6, H6Props } from '.';

const Template: Story<H6Props> = (args) => <H6 {...args} />;

const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  children: 'Primary heading 6'
};

const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  children: 'Secondary heading 6'
};

const Tertiary = Template.bind({});
Tertiary.args = {
  color: 'tertiary',
  children: 'Tertiary heading 6'
};

export { Primary, Secondary, Tertiary };

export default {
  title: 'Text/H6',
  component: H6
} as Meta;
