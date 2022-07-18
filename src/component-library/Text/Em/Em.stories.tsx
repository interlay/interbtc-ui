import { Meta,Story } from '@storybook/react';

import { Em, EmProps } from '.';

const Template: Story<EmProps> = (args) => <Em {...args} />;

const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  children: 'Primary emphasis'
};

const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  children: 'Secondary emphasis'
};

const Tertiary = Template.bind({});
Tertiary.args = {
  color: 'tertiary',
  children: 'Tertiary emphasis'
};

export { Primary, Secondary, Tertiary };

export default {
  title: 'Text/Em',
  component: Em
} as Meta;
