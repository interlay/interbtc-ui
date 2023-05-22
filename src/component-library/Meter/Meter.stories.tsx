import { Meta, Story } from '@storybook/react';
import { useState } from 'react';

import { Meter, MeterProps } from '.';

const Template: Story<MeterProps> = (args) => {
  const [warning, setWarning] = useState(60);
  const [error, setError] = useState(80);

  return (
    <>
      <input value={warning} type='number' onChange={(e) => e.target.value && setWarning(Number(e.target.value))} />
      <input value={error} type='number' onChange={(e) => e.target.value && setError(Number(e.target.value))} />
      <Meter {...args} ranges={[0, warning, error, 100]} />
    </>
  );
};

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
