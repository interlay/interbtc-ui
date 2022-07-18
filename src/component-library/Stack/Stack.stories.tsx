import { Meta,Story } from '@storybook/react';

import { Stack, StackProps } from '.';

const Template: Story<StackProps> = (args) => <Stack {...args} />;

const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <p>Stack children</p> <p>Stack children</p>
    </>
  )
};

export { Default };

export default {
  title: 'Layout/Stack',
  component: Stack
} as Meta;
