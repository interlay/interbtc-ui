import { Meta, Story } from '@storybook/react';

import { Input, InputProps } from '.';

const Template: Story<InputProps> = (args) => <Input {...args} />;

const Default = Template.bind({});
Default.args = {
  id: 'id',
  name: 'name',
  placeholder: 'placeholder'
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
