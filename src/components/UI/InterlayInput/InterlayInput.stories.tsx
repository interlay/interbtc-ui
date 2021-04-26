
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayInput, { Props } from './';

const Template: Story<Props> = args => <InterlayInput {...args} />;

const Primary = Template.bind({});
Primary.args = {
  id: 'id',
  name: 'name',
  placeholder: 'placeholder',
  color: 'primary'
};

const Secondary = Template.bind({});
Secondary.args = {
  id: 'id',
  name: 'name',
  placeholder: 'placeholder',
  color: 'secondary'
};

export {
  Primary,
  Secondary
};

export default {
  title: 'UI/InterlayInput',
  component: InterlayInput
} as Meta;
