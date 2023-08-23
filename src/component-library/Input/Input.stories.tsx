import { Meta, Story } from '@storybook/react';

import { Input, InputProps } from '.';

const Template: Story<InputProps> = (args) => <Input {...args} />;

const Default = Template.bind({});
Default.args = {
  placeholder: 'placeholder',
  label: 'Coin',
  labelPosition: 'side',
  errorMessage: "What's your favorite coin?",
  maxWidth: 'spacing12',
  justifyContent: 'space-between'
};

const Label = Template.bind({});
Label.args = {
  placeholder: 'placeholder',
  label: 'Coin',
  description: "What's your favorite coin?"
};

const Error = Template.bind({});
Error.args = {
  label: 'Coin',
  description: "What's your favorite coin?",
  errorMessage: 'Please enter your favorite coin!'
};

const MultipleErrors = Template.bind({});
MultipleErrors.args = {
  label: 'Coin',
  description: "What's your favorite coin?",
  errorMessage: ['Please enter your favorite coin!', 'Please enter a valid coin!']
};

const Disabled = Template.bind({});
Disabled.args = {
  label: 'Coin',
  description: "What's your favorite coin?",
  defaultValue: 'Bitcoin',
  isDisabled: true
};

const EndAdornment = Template.bind({});
EndAdornment.args = {
  endAdornment: 'Coin',
  placeholder: 'placeholder'
};

const StartAdornment = Template.bind({});
StartAdornment.args = {
  startAdornment: 'Coin',
  placeholder: 'placeholder'
};

export { Default, Disabled, EndAdornment, Error, MultipleErrors, StartAdornment };

export default {
  title: 'Forms/Input',
  component: Input
} as Meta;
