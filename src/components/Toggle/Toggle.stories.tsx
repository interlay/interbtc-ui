
import * as React from 'react';
import {
  Story,
  Meta
} from '@storybook/react';

import Toggle, { Props } from './';

const Template: Story<Props> = args => {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <Toggle
      {...args}
      checked={enabled}
      onChange={setEnabled} />
  );
};

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'Toggle',
  component: Toggle
} as Meta;
