import { Meta, Story } from '@storybook/react';
import { FieldError, useForm } from 'react-hook-form';

import { Input, InputProps } from '.';

const errorMessages = (error?: FieldError) => (error?.types ? Object.values(error.types).flat() : error?.message);

const Template: Story<InputProps> = (args) => {
  const { register, formState } = useForm<{ test: string }>({ mode: 'onChange', criteriaMode: 'all' });
  return (
    <Input
      {...args}
      {...register('test', {
        minLength: {
          value: 100,
          message: 'faul'
        },
        maxLength: {
          value: 1,
          message: 'This input exceed maxLength.'
        },
        validate: {
          a: () => false || 'Error message'
        }
      })}
      errorMessage={errorMessages(formState.errors.test)}
    />
  );
};

const Default = Template.bind({});
Default.args = {
  placeholder: 'placeholder',
  label: 'Coin',
  description: "What's your favorite coin?"
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
