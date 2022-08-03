import { Meta, Story } from '@storybook/react';

import { TextProps } from '../types';
import { H5 } from '.';

const Template: Story<TextProps> = (args) => <H5 {...args} />;

const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  children: 'Primary heading 5'
};

const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  children: 'Secondary heading 5'
};

const Tertiary = Template.bind({});
Tertiary.args = {
  color: 'tertiary',
  children: 'Tertiary heading 5'
};

export { Primary, Secondary, Tertiary };

export default {
  title: 'Text/H5',
  component: H5
} as Meta;
