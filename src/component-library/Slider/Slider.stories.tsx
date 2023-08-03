import { Meta, Story } from '@storybook/react';

import { Slider, SliderProps } from '.';

const Template: Story<SliderProps> = (args) => <Slider {...args} />;

const Default = Template.bind({});
Default.args = { label: 'Leverage', step: 1, minValue: 0, maxValue: 5, marks: false };

const Decimal = Template.bind({});
Decimal.args = { label: 'Leverage', step: 0.1, minValue: 0.1, maxValue: 0.5, marks: true };

export { Decimal, Default };

export default {
  title: 'Forms/Slider',
  component: Slider
} as Meta;
