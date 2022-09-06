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
  id: 'id',
  name: 'name',
  placeholder: 'placeholder',
  label: 'Coin',
  description: "What's your favorite coin?"
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

export { Default, EndAdornment, StartAdornment };

export default {
  title: 'Forms/Input',
  component: Input
} as Meta;
