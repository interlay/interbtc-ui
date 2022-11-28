import { Meta, Story } from '@storybook/react';

import { Meter, MeterProps } from '.';

const Template: Story<MeterProps> = (args) => <Meter {...args} />;

const StaticMeter = Template.bind({});
StaticMeter.args = {
  value: 20,
  ranges: [0, 20, 40, 60],
  variant: 'primary'
};

const DynamicMeter = Template.bind({});
DynamicMeter.args = {
  value: 20,
  ranges: [0, 60, 80, 100],
  variant: 'secondary'
};

export { DynamicMeter, StaticMeter };

export default {
  title: 'Elements/Meter',
  component: Meter
} as Meta;
