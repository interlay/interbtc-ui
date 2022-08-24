import { Meta, Story } from '@storybook/react';

import { ProgressCircle, ProgressCircleProps } from '.';

const Template: Story<ProgressCircleProps> = (args) => (
  <div
    style={{
      width: '100%',
      height: '300px',
      padding: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <ProgressCircle {...args} />
  </div>
);

const Determinate = Template.bind({});

Determinate.args = { value: 0, minValue: 0, maxValue: 100, diameter: 64, thickness: 3 };

export { Determinate };

export default {
  title: 'Elements/ProgressCircle',
  component: ProgressCircle
} as Meta;
