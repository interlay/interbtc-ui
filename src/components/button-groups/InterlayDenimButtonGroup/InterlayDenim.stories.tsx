
import {
  Story,
  Meta
} from '@storybook/react';

import InterlayDenimButtonGroup, {
  InterlayDenimButtonGroupItem
} from '.';

const Template: Story = args => <InterlayDenimButtonGroup {...args} />;

const Default = Template.bind({});
Default.args = {
  children: (
    <InterlayDenimButtonGroup>
      <InterlayDenimButtonGroupItem>
        Years
      </InterlayDenimButtonGroupItem>
      <InterlayDenimButtonGroupItem>
        Months
      </InterlayDenimButtonGroupItem>
      <InterlayDenimButtonGroupItem>
        Days
      </InterlayDenimButtonGroupItem>
    </InterlayDenimButtonGroup>
  )
};

export {
  Default
};

export default {
  title: 'button-groups/InterlayDenimButtonGroup',
  component: InterlayDenimButtonGroup
} as Meta;
