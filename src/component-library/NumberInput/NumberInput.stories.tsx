import { Meta, Story } from '@storybook/react';

import { NumberInput, NumberInputProps } from '.';

const Template: Story<NumberInputProps> = (args) => <NumberInput {...args} />;

const Default = Template.bind({});
Default.args = { defaultValue: 10, isDisabled: false };

const Disabled = Template.bind({});
Disabled.args = {
  label: 'Amount',
  description: "What's your amount?",
  defaultValue: 10
};

export { Default, Disabled };

export default {
  title: 'Forms/NumberInput',
  component: NumberInput
} as Meta;
