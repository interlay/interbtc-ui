
import * as React from 'react';
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayDenimToggleButtonGroup, {
  InterlayDenimToggleButtonGroupItem
} from '.';

const Template: Story = args => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <InterlayDenimToggleButtonGroup
      {...args}
      value={selectedIndex}
      onChange={setSelectedIndex}>
      <InterlayDenimToggleButtonGroupItem value={0}>
        Years
      </InterlayDenimToggleButtonGroupItem>
      <InterlayDenimToggleButtonGroupItem value={1}>
        Months
      </InterlayDenimToggleButtonGroupItem>
      <InterlayDenimToggleButtonGroupItem value={2}>
        Days
      </InterlayDenimToggleButtonGroupItem>
    </InterlayDenimToggleButtonGroup>
  );
};

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'toggle-button-groups/InterlayDenimToggleButtonGroup',
  component: InterlayDenimToggleButtonGroup
} as Meta;
