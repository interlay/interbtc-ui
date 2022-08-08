import { Meta, Story } from '@storybook/react';

import { TextProps } from '../types';
import { H3 } from '.';

const Template: Story<TextProps> = (args) => <H3 {...args} />;

const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  children: 'Primary heading 3'
};

const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  children: 'Secondary heading 3'
};

const Tertiary = Template.bind({});
Tertiary.args = {
  color: 'tertiary',
  children: 'Tertiary heading 3'
};

export { Primary, Secondary, Tertiary };

export default {
  title: 'Text/H3',
  component: H3
} as Meta;
