
import {
  Story,
  Meta
} from '@storybook/react';

import TextField, { Props } from './';

const Template: Story<Props> = args => <TextField {...args} />;

const Default = Template.bind({});
Default.args = {
  id: 'id',
  label: 'label',
  error: true,
  helperText: 'helperText',
  required: true
};

export {
  Default
};

export default {
  title: 'TextField',
  component: TextField
} as Meta;
