import { Meta, Story } from '@storybook/react';

import { P } from '../Text';
import { Stack, StackProps } from '.';

const Template: Story<StackProps> = (args) => <Stack {...args} />;

const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <P>Stack children</P> <P>Stack children</P>
    </>
  )
};

export { Default };

export default {
  title: 'Layout/Stack',
  component: Stack
} as Meta;
