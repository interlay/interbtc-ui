import { Meta, Story } from '@storybook/react';

import { Switch, SwitchProps } from '.';

const Template: Story<SwitchProps> = (args) => <Switch {...args} aria-label='hide all balances' />;

const Default = Template.bind({});
Default.args = {
  children: 'Hide all balances'
};

export { Default };

export default {
  title: 'Forms/Switch',
  component: Switch
} as Meta;
