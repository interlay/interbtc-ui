import { Meta, Story } from '@storybook/react';

import { Slider, SliderProps } from '.';

const Template: Story<SliderProps> = (args) => <Slider {...args} />;

const Default = Template.bind({});
Default.args = { label: 'Leverage', minValue: 1, maxValue: 5 };

export { Default };

export default {
  title: 'Forms/Slider',
  component: Slider
} as Meta;
