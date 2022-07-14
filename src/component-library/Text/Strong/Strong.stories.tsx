import { Story, Meta } from '@storybook/react';

import { Strong, StrongProps } from '.';

const Template: Story<StrongProps> = (args) => <Strong {...args} />;

const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  children: 'Primary strong'
};

const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  children: 'Secondary strong'
};

const Tertiary = Template.bind({});
Tertiary.args = {
  color: 'tertiary',
  children: 'Tertiary strong'
};

export { Primary, Secondary, Tertiary };

export default {
  title: 'Text/Strong',
  component: Strong
} as Meta;
