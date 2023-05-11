import { Meta, Story } from '@storybook/react';

import { P } from '../Text';
import { Tabs, TabsItem, TabsProps } from '.';

const Template: Story<TabsProps> = (args) => (
  <Tabs {...args} disabledKeys={['recent']}>
    <TabsItem key='recent' title='Recent'>
      <P>All</P>
    </TabsItem>
    <TabsItem key='pending' title='Pending'>
      <P>Pending</P>
    </TabsItem>
    <TabsItem key='issue' title='Issue'>
      <P>Issue</P>
    </TabsItem>
    <TabsItem key='redeem' title='Redeem'>
      <P>Redeem</P>
    </TabsItem>
    <TabsItem key='replace' title='Replace'>
      <P>Replace</P>
    </TabsItem>
  </Tabs>
);

const Default = Template.bind({});
Default.args = {};

const Simple: Story<TabsProps> = (args) => (
  <Tabs style={{ maxWidth: 350 }} {...args}>
    <TabsItem key='lend' title='Lend'>
      <P>Lend</P>
    </TabsItem>
    <TabsItem key='withdraw' title='Withdraw'>
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
