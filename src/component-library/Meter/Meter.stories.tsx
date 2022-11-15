import { Meta, Story } from '@storybook/react';

import { Meter, MeterProps } from '.';

const Template: Story<MeterProps> = (args) => <Meter {...args} />;

const Default = Template.bind({});
Default.args = {
  value: 20,
  ranges: [0, 20, 40, 60]
};

const WithRanges = Template.bind({});
WithRanges.args = {
  value: 20,
  ranges: [0, 20, 40, 60],
  showRanges: true
};

export { Default, WithRanges };

export default {
  title: 'Elements/Meter',
  component: Meter
} as Meta;
