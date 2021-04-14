
import {
  Story,
  Meta
} from '@storybook/react';

import { Button, ButtonProps } from './Button';

const Template: Story<ButtonProps> = (args: ButtonProps) => <Button {...args} />;

const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button'
};

const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button'
};

const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button'
};

const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button'
};

export {
  Primary,
  Secondary,
  Large,
  Small
};

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta;
