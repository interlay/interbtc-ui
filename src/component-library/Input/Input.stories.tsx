// ray test touch <
import { Story, Meta } from '@storybook/react';

import { Input, InputProps } from '.';

const Template: Story<InputProps> = (args) => <Input {...args} />;

const Default = Template.bind({});
Default.args = {};

export { Default };

export default {
  title: 'Forms/Input',
  component: Default
} as Meta;
// ray test touch >
