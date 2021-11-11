
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayInput, { Props } from './';

const Template: Story<Props> = args => <InterlayInput {...args} />;

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
  title: 'UI/InterlayInput',
  component: InterlayInput
} as Meta;
