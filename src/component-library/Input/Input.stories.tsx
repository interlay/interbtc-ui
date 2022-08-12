import { Meta, Story } from '@storybook/react';

import { Input, InputAdornment, InputProps } from '.';

const Template: Story<InputProps> = (args) => <Input {...args} />;

const Default = Template.bind({});
Default.args = {
  id: 'id',
  name: 'name',
  placeholder: 'placeholder'
};

const EndAdornment = Template.bind({});
EndAdornment.args = {
  endAdornment: <InputAdornment>Coin</InputAdornment>,
  placeholder: 'placeholder'
};

export { Default, EndAdornment };

export default {
  title: 'Forms/Input',
  component: Input
} as Meta;
