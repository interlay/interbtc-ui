import { Meta, Story } from '@storybook/react';

import { ProgressBar, ProgressBarProps } from '.';

const Template: Story<ProgressBarProps> = (args) => <ProgressBar {...args} />;

const Default = Template.bind({});
Default.args = {
  value: 20,
  label: 'Loading...'
};

export { Default };

export default {
  title: 'Elements/ProgressBar',
  component: ProgressBar
} as Meta;
