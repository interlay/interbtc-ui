import { Meta, Story } from '@storybook/react';

import { Card, CardProps } from '.';

const Template: Story<CardProps> = (args) => <Card {...args} />;

const Default = Template.bind({});
Default.args = { children: 'Default' };

const Bordered = Template.bind({});
Bordered.args = {
  children: 'Bordered',
  variant: 'bordered'
};

export { Bordered, Default };

export default {
  title: 'Components/Card',
  component: Card
} as Meta;
