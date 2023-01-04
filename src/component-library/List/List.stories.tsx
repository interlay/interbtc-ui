import { Meta, Story } from '@storybook/react';

import { List, ListItem, ListProps } from '.';

const Template: Story<ListProps> = (args) => (
  <List aria-label='Example List' onSelectionChange={console.log} {...args}>
    <ListItem key='1' textValue='IBTC'>
      IBTC
    </ListItem>
    <ListItem key='2' textValue='KINT'>
      KINT
    </ListItem>
    <ListItem key='3' textValue='INTR'>
      INTR
    </ListItem>
    <ListItem key='4' textValue='KSM'>
      KSM
    </ListItem>
    <ListItem key='5' textValue='DOT'>
      DOT
    </ListItem>
  </List>
);

const Default = Template.bind({});
Default.args = {
  selectionMode: 'single'
};

export { Default };

export default {
  title: 'Collections/List',
  component: List
} as Meta;
