import { Meta, Story } from '@storybook/react';

import { Meter, MeterProps } from '.';

const Template: Story<MeterProps> = (args) => <Meter {...args} />;

const Default = Template.bind({});
Default.args = {
  percentage: 20
};

export { Default };

export default {
  title: 'Elements/Meter',
  component: Meter
} as Meta;
