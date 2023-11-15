import { Meta, Story } from '@storybook/react';
import { useState } from 'react';

import { List, ListItem, ListProps } from '.';

const Template: Story<ListProps> = (args) => {
  const [value, setValue] = useState<string>();

  const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
    const [selectedKey] = [...key];

    setValue(selectedKey?.toString());
  };

  return (
    <div style={{ padding: 20 }}>
      <List
        aria-label='Example List'
        {...args}
        selectedKeys={value ? [value] : undefined}
        onSelectionChange={handleSelectionChange}
      >
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
    </div>
  );
};

const Default = Template.bind({});
Default.args = {
  selectionMode: 'single'
};

const Cards = Template.bind({});
Cards.args = {
  selectionMode: 'single',
  variant: 'card'
};

export { Cards, Default };

export default {
  title: 'Collections/List',
  component: List
} as Meta;
