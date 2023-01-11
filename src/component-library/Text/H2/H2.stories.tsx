import { Meta, Story } from '@storybook/react';

import { H2, H2Props } from '.';

const Template: Story<H2Props> = (args) => <H2 {...args} />;

const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  children: 'Primary heading 2'
};

const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  children: 'Secondary heading 2'
};

const Tertiary = Template.bind({});
Tertiary.args = {
  color: 'tertiary',
  children: 'Tertiary heading 2'
};

export { Primary, Secondary, Tertiary };

export default {
  title: 'Text/H2',
  component: H2
} as Meta;
