
import {
  Story,
  Meta
} from '@storybook/react';

import NumberInput, { Props } from './';

const Template: Story<Props> = args => <NumberInput {...args} />;

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
  title: 'NumberInput',
  component: NumberInput
} as Meta;
