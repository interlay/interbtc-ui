import { Meta, Story } from '@storybook/react';

import { TextProps } from '../types';
import { Span } from '.';

const Template: Story<TextProps> = (args) => <Span {...args} />;

const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  children: 'Primary span'
};

const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  children: 'Secondary span'
};

const Tertiary = Template.bind({});
Tertiary.args = {
  color: 'tertiary',
  children: 'Tertiary span'
};

export { Primary, Secondary, Tertiary };

export default {
  title: 'Text/Span',
  component: Span
} as Meta;
