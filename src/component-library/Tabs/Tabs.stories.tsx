import { Meta, Story } from '@storybook/react';

import { P } from '../Text';
import { Tabs, TabsItem, TabsProps } from '.';

const Template: Story<TabsProps> = (args) => (
  <Tabs {...args}>
    <TabsItem title='Recent'>
      <P>All</P>
    </TabsItem>
    <TabsItem title='Pending'>
      <P>Pending</P>
    </TabsItem>
    <TabsItem title='Issue'>
      <P>Issue</P>
    </TabsItem>
    <TabsItem title='Redeem'>
      <P>Redeem</P>
    </TabsItem>
    <TabsItem title='Replace'>
      <P>Replace</P>
    </TabsItem>
  </Tabs>
);

const Default = Template.bind({});
Default.args = {};

const Simple: Story<TabsProps> = (args) => (
  <Tabs style={{ maxWidth: 350 }} {...args}>
    <TabsItem title='Lend'>
      <P>Lend</P>
    </TabsItem>
    <TabsItem title='Withdraw'>
      <P>Withdraw</P>
    </TabsItem>
  </Tabs>
);

const FullWith = Simple.bind({});
FullWith.args = { fullWidth: true, size: 'large' };

export { Default, FullWith };

export default {
  title: 'Components/Tabs',
  component: Tabs
} as Meta;
