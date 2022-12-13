import { Meta, Story } from '@storybook/react';

import { Flex } from '../Flex';
import { H3, P } from '../Text';
import { Divider, DividerProps } from '.';

const Template: Story<DividerProps> = ({ orientation, ...args }) => (
  <Flex direction={orientation === 'horizontal' ? 'column' : 'row'} gap='spacing4'>
    <H3>Divider</H3>
    <Divider {...args} orientation={orientation} />
    <P>Content</P>
  </Flex>
);

const Default = Template.bind({});
Default.args = {};

export { Default };

export default {
  title: 'Components/Divider',
  component: Divider
} as Meta;
