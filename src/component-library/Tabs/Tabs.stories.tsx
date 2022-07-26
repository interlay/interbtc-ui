import { Meta, Story } from '@storybook/react';
import { Item } from 'react-stately';

import { Tabs, TabsProps } from '.';

const Template: Story<TabsProps> = (args) => (
  <Tabs {...args}>
    <Item title='Recent'>Recent</Item>
    <Item title='Favorites'>Favorites</Item>
    <Item title='All'>All</Item>
  </Tabs>
);

const Default = Template.bind({});
Default.args = {};

export { Default };

export default {
  title: 'Components/Tabs',
  component: Tabs
} as Meta;
