
import {
  Story,
  Meta
} from '@storybook/react';

import { Button, ButtonProps } from './';

const Template: Story<ButtonProps> = args => <Button {...args} />;

const Default = Template.bind({});
Default.args = {
  id: 'id',
  name: 'name',
  placeholder: 'placeholder'
};

export {
  Default
};

export default {
  title: 'Component Library/Button',
  component: Button
} as Meta;
