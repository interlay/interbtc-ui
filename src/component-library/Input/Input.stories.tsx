import { Story, Meta } from '@storybook/react';

import { Input, InputProps } from '.';

const Template: Story<InputProps> = (args) => <Input {...args} />;

const Default = Template.bind({});
Default.args = {
  id: 'id',
  name: 'name',
  placeholder: 'placeholder'
};

export { Default };

export default {
  title: 'Forms/Input',
  component: Input
} as Meta;
