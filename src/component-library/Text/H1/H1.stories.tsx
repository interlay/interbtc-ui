import { Meta, Story } from '@storybook/react';

import { TextProps } from '../types';
import { H1 } from '.';

const Template: Story<TextProps> = (args) => <H1 {...args} />;

const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  children: 'Primary heading 1'
};

const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  children: 'Secondary heading 1'
};

const Tertiary = Template.bind({});
Tertiary.args = {
  color: 'tertiary',
  children: 'Tertiary heading 1'
};

export { Primary, Secondary, Tertiary };

export default {
  title: 'Text/H1',
  component: H1
} as Meta;
