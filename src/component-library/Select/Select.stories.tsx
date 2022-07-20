import { Story, Meta } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { Select, Item } from '.';

const Template: Story<any> = (args) => {
  const { register, handleSubmit } = useForm({ defaultValues: { example: '' } });
  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Select {...{ ...args, ...register('example') }}>
        <Item key='BTC'>BTC</Item>
        <Item key='ETH'>ETH</Item>
        <Item key='DOT'>DOT</Item>
      </Select>
      <button type='submit'>Submit</button>
    </form>
  );
};

const Default = Template.bind({});
Default.args = {
  placeholder: 'placeholder',
  label: 'Coin',
  description: 'Select a coin'
};

export { Default };

export default {
  title: 'Forms/Select',
  component: Select
} as Meta;
